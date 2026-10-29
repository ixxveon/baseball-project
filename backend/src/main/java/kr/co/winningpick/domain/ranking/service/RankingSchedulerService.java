package kr.co.winningpick.domain.ranking.service;

import kr.co.winningpick.domain.ranking.entity.Ranking;
import kr.co.winningpick.domain.ranking.repository.RankingRepository;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.*;

@Service
public class RankingSchedulerService {

    private final RankingRepository rankingRepository;

    public RankingSchedulerService(RankingRepository rankingRepository) {
        this.rankingRepository = rankingRepository;
    }

    /**
     * 서버 시작 시 즉시 1회 실행 + 매일 밤 23:30 자동 스케줄링
     */
    @EventListener(ApplicationReadyEvent.class)
    @Scheduled(cron = "0 30 23 * * ?")
    @Transactional
    public void updateRankingsFromHtml() {
        try {
            ClassPathResource resource = new ClassPathResource("dataset/raw_crawl_04_match_schedule.html");
            InputStream inputStream = resource.getInputStream();
            Document doc = Jsoup.parse(inputStream, "UTF-8", "");

            Map<String, TeamStat> statMap = new HashMap<>();

            Elements rows = doc.select("tr");
            for (Element row : rows) {
                Element statusElem = row.selectFirst("td.col_status");
                if (statusElem == null || !"경기종료".equals(statusElem.text().trim())) {
                    continue;
                }

                String homeTeam = row.select("td.col_home").text().trim();
                String awayTeam = row.select("td.col_away").text().trim();
                String scoreText = row.select("td.col_score").text().trim();

                if (homeTeam.isEmpty() || awayTeam.isEmpty() || !scoreText.contains(":")) {
                    continue;
                }

                String[] scores = scoreText.split(":");
                int homeScore = Integer.parseInt(scores[0].trim());
                int awayScore = Integer.parseInt(scores[1].trim());

                statMap.putIfAbsent(homeTeam, new TeamStat(homeTeam));
                statMap.putIfAbsent(awayTeam, new TeamStat(awayTeam));

                TeamStat homeStat = statMap.get(homeTeam);
                TeamStat awayStat = statMap.get(awayTeam);

                if (homeScore > awayScore) {
                    homeStat.wins++;
                    awayStat.losses++;
                } else if (homeScore < awayScore) {
                    homeStat.losses++;
                    awayStat.wins++;
                } else {
                    homeStat.draws++;
                    awayStat.draws++;
                }
            }

            List<TeamStat> teamList = new ArrayList<>(statMap.values());

            // KBO 승률 순 정렬 (승률 같으면 승수 많은 순)
            teamList.sort((a, b) -> {
                if (Double.compare(b.getWinRate(), a.getWinRate()) != 0) {
                    return Double.compare(b.getWinRate(), a.getWinRate());
                }
                return Integer.compare(b.wins, a.wins);
            });

            if (!teamList.isEmpty()) {
                TeamStat leader = teamList.get(0);

                // 1. 기존 DB 데이터 삭제 후 즉시 반영(flush)하여 Unique 충돌 방지
                rankingRepository.deleteAll();
                rankingRepository.flush();

                // 2. 새로운 1~10위 랭킹 리스트 생성
                List<Ranking> rankingsToSave = new ArrayList<>();
                for (int i = 0; i < teamList.size(); i++) {
                    TeamStat stat = teamList.get(i);
                    stat.rank = i + 1;
                    stat.gamesBehind = ((leader.wins - stat.wins) + (stat.losses - leader.losses)) / 2.0;

                    Ranking ranking = Ranking.builder()
                            .teamName(stat.teamName)
                            .teamRank(stat.rank)
                            .games(stat.getTotalGames())
                            .wins(stat.wins)
                            .draws(stat.draws)
                            .losses(stat.losses)
                            .winRate(stat.getWinRate())
                            .gameDiff(stat.gamesBehind)
                            .build();

                    rankingsToSave.add(ranking);
                }

                // 3. 일괄 저장
                rankingRepository.saveAll(rankingsToSave);

                System.out.println("=========================================================");
                System.out.println("KBO 랭킹 데이터 10건이 DB(rankings)에 성공적으로 저장되었습니다.");
                System.out.println("=========================================================");
            }

        } catch (Exception e) {
            System.err.println("HTML 파싱 및 DB 저장 중 오류 발생: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static class TeamStat {
        String teamName;
        int rank;
        int wins = 0;
        int draws = 0;
        int losses = 0;
        double gamesBehind = 0.0;

        public TeamStat(String teamName) {
            this.teamName = teamName;
        }

        public int getTotalGames() {
            return wins + draws + losses;
        }

        public double getWinRate() {
            if (wins + losses == 0) return 0.0;
            return (double) wins / (wins + losses);
        }
    }
}
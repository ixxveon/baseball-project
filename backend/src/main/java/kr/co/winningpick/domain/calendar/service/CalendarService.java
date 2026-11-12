package kr.co.winningpick.domain.calendar.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import kr.co.winningpick.domain.calendar.dto.CalendarGameResponse;
import kr.co.winningpick.domain.calendar.repository.CalendarRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CalendarService {

    private final CalendarRepository calendarRepository;

    public List<CalendarGameResponse> getRecommendedGames(String teamName, String yearMonth) {
        if (yearMonth != null && yearMonth.contains("년")) {
            yearMonth = yearMonth.replace("년 ", "-").replace("월", "").trim();
            String[] parts = yearMonth.split("-");
            if (parts.length == 2 && parts[1].length() == 1) {
                yearMonth = parts[0] + "-0" + parts[1];
            }
        }

        log.info("👉 [캘린더 조회] 요청 팀: {}, 변환된 연월: {}", teamName, yearMonth);

        // raw 타입으로 받아와서 타입 불일치 에러 원천 차단
        List rawGames = calendarRepository.findUpcomingGamesWithPredictions(teamName, yearMonth);

        log.info("👉 [캘린더 조회] DB에서 조회된 경기 수: {}개", rawGames.size());

        List<CalendarGameResponse> responses = new ArrayList<>();
        ObjectMapper objectMapper = new ObjectMapper();

        for (Object obj : rawGames) {
            Map<String, Object> row = (Map<String, Object>) obj;

            String homeTeam = (String) row.get("homeTeamName");
            String awayTeam = (String) row.get("awayTeamName");
            boolean isHome = homeTeam.contains(teamName);

            double homeWinProb = ((Number) row.get("homeWinProb")).doubleValue();
            double myTeamWinProb = isHome ? homeWinProb : (100.0 - homeWinProb);

            int baseScore = ((Number) row.get("recommendationScore")).intValue();
            int weatherAdj = ((Number) row.get("weatherAdjustment")).intValue();
            int myTeamScore = isHome ? baseScore : (int) Math.round(myTeamWinProb + weatherAdj);

            CalendarGameResponse.SummaryDto summary = null;
            Object resultJsonObj = row.get("resultJson");
            if (resultJsonObj != null) {
                try {
                    String jsonStr = resultJsonObj.toString();
                    Map<String, Object> jsonMap = objectMapper.readValue(jsonStr, Map.class);

                    summary = CalendarGameResponse.SummaryDto.builder()
                            .pitcherComparison((String) jsonMap.getOrDefault("pitcherComparison", "선발 투수 분석 정보가 없습니다."))
                            .battingComparison((String) jsonMap.getOrDefault("battingComparison", "타선 분석 정보가 없습니다."))
                            .homeAdvantage((String) jsonMap.getOrDefault("homeAdvantage", "홈 이점 분석 정보가 없습니다."))
                            .headToHead((String) jsonMap.getOrDefault("headToHead", "상대 전적 분석 정보가 없습니다."))
                            .keyPlayer((String) jsonMap.getOrDefault("keyPlayer", "주요 선수 분석 정보가 없습니다."))
                            .weatherComment((String) jsonMap.getOrDefault("weatherComment", "날씨 영향 정보가 없습니다."))
                            .build();
                } catch (Exception e) {
                    log.error("AI Prediction result_json 파싱 실패", e);
                }
            }

            responses.add(CalendarGameResponse.builder()
                    .gameId(((Number) row.get("gameId")).longValue())
                    .matchDate((String) row.get("matchDate"))
                    .matchTime(row.get("matchTime") != null ? row.get("matchTime").toString() : "18:30")
                    .homeTeamName(homeTeam)
                    .awayTeamName(awayTeam)
                    .myTeamScore(myTeamScore)
                    .myTeamWinProb(Math.round(myTeamWinProb * 10.0) / 10.0)
                    .weatherCondition(weatherAdj < -10 ? "비 예보" : "맑음")
                    .isRain(weatherAdj < -20)
                    .weatherAdjustment(weatherAdj)
                    .summary(summary)
                    .build());
        }

        return responses;
    }
}
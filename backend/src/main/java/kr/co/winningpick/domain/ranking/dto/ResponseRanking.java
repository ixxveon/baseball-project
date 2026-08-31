package kr.co.winningpick.domain.ranking.dto.response;

import kr.co.winningpick.domain.ranking.entity.Ranking;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResponseRanking {
    private Integer teamRank;
    private String teamName;
    private Integer games;
    private Integer wins;
    private Integer draws;
    private Integer losses;
    private Double winRate;
    private Double gameDiff;
    private String streak;

    // Entity(DB 데이터)를 DTO(접시)로 예쁘게 옮겨 담는 마법의 함수입니다!
    public static ResponseRanking from(Ranking ranking) {
        return ResponseRanking.builder()
                .teamRank(ranking.getTeamRank())
                .teamName(ranking.getTeamName())
                .games(ranking.getGames())
                .wins(ranking.getWins())
                .draws(ranking.getDraws())
                .losses(ranking.getLosses())
                .winRate(ranking.getWinRate())
                .gameDiff(ranking.getGameDiff())
                .streak(ranking.getStreak())
                .build();
    }
}
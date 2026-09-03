package kr.co.winningpick.domain.ranking.dto.response;

import kr.co.winningpick.domain.ranking.entity.Ranking;


public record ResponseRanking(
        Integer teamRank,
        String teamName,
        Integer games,
        Integer wins,
        Integer draws,
        Integer losses,
        Double winRate,  // 👈 앞선 리뷰 내용 반영 (String -> Double)
        Double gameDiff, // 👈 앞선 리뷰 내용 반영 (String -> Double)
        String streak
) {

    // Entity를 DTO로 변환하는 정적 메서드
    public static ResponseRanking from(Ranking ranking) {
        return new ResponseRanking(
                ranking.getTeamRank(),
                ranking.getTeamName(),
                ranking.getGames(),
                ranking.getWins(),
                ranking.getDraws(),
                ranking.getLosses(),
                ranking.getWinRate(),
                ranking.getGameDiff(),
                ranking.getStreak()
        );
    }
}
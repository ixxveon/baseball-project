package kr.co.winningpick.domain.calendar.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CalendarGameResponse {
    private Long gameId;
    private String matchDate;          // "2026-08-17"
    private String matchTime;          // "18:30"
    private String homeTeamName;       // "LG"
    private String awayTeamName;       // "KIA"

    // 선택한 응원팀 관점 점수 및 승률
    private Integer myTeamScore;       // 선택한 팀의 최종 직관 점수 (0~100)
    private Double myTeamWinProb;      // 선택한 팀의 순수 AI 승률 (%)

    // 날씨 정보
    private String weatherCondition;   // "맑음", "구름많음", "비" 등
    private Boolean isRain;            // 우천 여부
    private Double temperature;        // 기온 (°C)
    private Integer weatherAdjustment; // 날씨 보정치 (-90 ~ +5)

    // AI 상세 분석 요약 (모달 팝업용)
    private String scorePredict;       // "5:3"
    private SummaryDto summary;

    @Getter
    @Builder
    public static class SummaryDto {
        private String pitcherComparison; // 투수 비교
        private String battingComparison; // 타선 가중 생산력
        private String homeAdvantage;     // 홈 이점
        private String headToHead;        // 상대 전적
        private String keyPlayer;         // 키플레이어
        private String weatherComment;    // 날씨 서술
    }
}
package kr.co.winningpick.domain.calendar.dto;

import lombok.Builder;

@Builder
public record ResponseCalendarSummary(
        String pitcherComparison,
        String battingComparison,
        String homeAdvantage,
        String headToHead,
        String keyPlayer,
        String weatherComment
) {}
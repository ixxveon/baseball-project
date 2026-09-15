package kr.co.winningpick.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record ProfileUpdateRequest(
        @Schema(description = "변경할 닉네임 (변경 안 할 시 null)", example = "승요등장")
        String nickname,

        @Schema(description = "변경할 최애 구단 (변경 안 할 시 null)", example = "LG 트윈스")
        Long favoriteTeamId,

        @Schema(description = "푸시 알림 수신 여부 (변경 안 할 시 null)", example = "true")
        Boolean pushAlarm
) {}
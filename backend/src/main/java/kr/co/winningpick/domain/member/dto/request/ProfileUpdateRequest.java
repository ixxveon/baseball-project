package kr.co.winningpick.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

public record ProfileUpdateRequest(
        @Schema(description = "변경할 닉네임", example = "승요등장")
        @Size(min = 2, max = 10, message = "닉네임은 2자 이상 10자 이하로 입력해주세요.")
        String nickname,

        @Schema(description = "변경할 최애 구단 (변경 안 할 시 null)", example = "2")
        Long favoriteTeamId,

        @Schema(description = "푸시 알림 수신 여부 (변경 안 할 시 null)", example = "true")
        Boolean pushAlarm
) {}
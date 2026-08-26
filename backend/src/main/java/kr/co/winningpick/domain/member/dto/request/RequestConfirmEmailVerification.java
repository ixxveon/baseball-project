package kr.co.winningpick.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record RequestConfirmEmailVerification(
        @Schema(example = "test@example.com") String email,
        @Schema(example = "123456") String code) {
}

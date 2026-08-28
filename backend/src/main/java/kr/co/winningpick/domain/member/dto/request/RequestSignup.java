package kr.co.winningpick.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record RequestSignup(
        @Schema(example = "test@example.com") String email,
        @Schema(example = "야구왕") String nickname,
        @Schema(example = "password1234") String password
) {
}

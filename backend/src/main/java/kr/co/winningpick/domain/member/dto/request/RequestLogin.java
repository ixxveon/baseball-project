package kr.co.winningpick.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record RequestLogin(
        @Schema(example = "test@example.com") String email,
        @Schema(example = "password1234") String password) {
}

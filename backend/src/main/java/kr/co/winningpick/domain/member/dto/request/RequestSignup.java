package kr.co.winningpick.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record RequestSignup(
        @NotBlank @Email @Schema(example = "test@example.com") String email,
        @NotBlank @Schema(example = "야구왕") String nickname,
        @NotBlank @Schema(example = "password1234") String password
) {
}

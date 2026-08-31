package kr.co.winningpick.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RequestConfirmEmailVerification(
        @NotBlank @Email @Schema(example = "test@example.com") String email,
        @NotBlank @Schema(example = "123456") String code) {
}

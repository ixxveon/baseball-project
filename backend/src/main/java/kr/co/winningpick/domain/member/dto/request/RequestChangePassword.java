package kr.co.winningpick.domain.member.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record RequestChangePassword(
        @NotBlank @Schema(example = "password1234") String currentPassword,
        @NotBlank
        @Pattern(regexp = "^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$", message = "새 비밀번호는 영문과 숫자를 포함해 8자 이상이어야 합니다")
        @Schema(example = "newPassword1234") String newPassword
) {
}
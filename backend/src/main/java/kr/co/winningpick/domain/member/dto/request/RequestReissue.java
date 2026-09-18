package kr.co.winningpick.domain.member.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RequestReissue(
        @NotBlank String refreshToken
) {
}

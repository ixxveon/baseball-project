package kr.co.winningpick.domain.community.dto.request;

import jakarta.validation.constraints.NotBlank;

public record RequestCreateComment(
        @NotBlank String content
) {
}

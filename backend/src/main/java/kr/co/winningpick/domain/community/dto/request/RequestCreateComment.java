package kr.co.winningpick.domain.community.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record RequestCreateComment(
        @NotBlank @Schema(example = "정말 짱이네요!") String content
) {
}

package kr.co.winningpick.domain.community.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.co.winningpick.domain.community.type.PostCategoryType;

public record RequestCreatePost(
        @NotNull Long gameId,
        @NotBlank String title,
        @NotBlank String content,
        @NotNull PostCategoryType category
        ) {
}

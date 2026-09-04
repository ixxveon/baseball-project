package kr.co.winningpick.domain.community.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.co.winningpick.domain.community.type.PostCategoryType;

public record RequestCreatePost(
        @NotNull @Schema(example = "1") Long gameId,
        @NotBlank @Schema(example = "오늘 경기 어땠나요") String title,
        @NotBlank @Schema(example = "아빌라 완봉승 했답니다") String content,
        @NotNull @Schema(example = "PREVIEW") PostCategoryType category
        ) {
}

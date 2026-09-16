package kr.co.winningpick.domain.community.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import kr.co.winningpick.domain.community.type.PostCategoryType;

public record RequestUpdatePost(
        @NotBlank @Schema(example = "수정된 제목") String title,
        @NotBlank @Schema(example = "수정된 내용") String content,
        @NotNull @Schema(example = "CERTIFICATION")PostCategoryType category
        ) {
}

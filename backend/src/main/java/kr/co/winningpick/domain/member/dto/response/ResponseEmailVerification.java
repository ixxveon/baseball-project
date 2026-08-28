package kr.co.winningpick.domain.member.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record ResponseEmailVerification(
        @Schema(example = "true") boolean verified) {
}

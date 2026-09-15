package kr.co.winningpick.domain.member.dto.response;

import java.time.LocalDateTime;

public record ResponseReissue(String accessToken, LocalDateTime expiresAt) {
}

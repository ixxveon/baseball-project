package kr.co.winningpick.domain.member.dto.response;

import java.time.LocalDateTime;

public record ResponseLogin(String accessToken, LocalDateTime expiresAt) {
}

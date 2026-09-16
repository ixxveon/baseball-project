package kr.co.winningpick.global.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Date;

@Component
public class JwtProvider {

    private final SecretKey secretKey;

    private final Duration accessTokenValidity;

    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-validity-in-seconds}") long validityInSeconds
    ) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());

        this.accessTokenValidity = Duration.ofSeconds(validityInSeconds);
    }

    public String createAccessToken(Long memberId) {
        Date now = new Date();

        Date expiry = new Date(now.getTime() + accessTokenValidity.toMillis());

        return Jwts.builder()
                .subject(String.valueOf(memberId))
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)
                .compact();
    }

    public Duration getAccessTokenValidity() {
        // 5. MemberService 등에 만료 시간을 알려줄 때도 새로 설정한 시간을 줍니다.
        return accessTokenValidity;
    }
}
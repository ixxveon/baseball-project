package kr.co.winningpick.global.util;

import io.jsonwebtoken.Claims; // 👈 누락됐던 import 추가
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.time.Duration;
import java.util.Date;

@Component
public class JwtProvider {


    private static final Duration REFRESH_TOKEN_VALIDITY = Duration.ofDays(14);

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


    public String createRefreshToken(Long memberId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + REFRESH_TOKEN_VALIDITY.toMillis());

        return Jwts.builder()
                .subject(String.valueOf(memberId))
                .issuedAt(now)
                .expiration(expiry)
                .signWith(secretKey)
                .compact();
    }


    public Long getMemberId(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return Long.valueOf(claims.getSubject());
    }

    public Duration getAccessTokenValidity() {
        return accessTokenValidity;
    }


    public Duration getRefreshTokenValidity() {
        return REFRESH_TOKEN_VALIDITY;
    }
}
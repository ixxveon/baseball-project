package kr.co.winningpick.domain.member.service;

import kr.co.winningpick.domain.member.exception.MemberErrorCode;
import kr.co.winningpick.domain.member.repository.MemberRepository;
import kr.co.winningpick.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MemberService {

    private static final Duration VERIFICATION_CODE_TTL = Duration.ofMinutes(5);

    private final StringRedisTemplate stringRedisTemplate;

    private final MemberRepository memberRepository;

    public void sendEmailVerification(String email) {
        String code = generateVerificationCode();
        stringRedisTemplate.opsForValue().set(verificationKey(email), code, VERIFICATION_CODE_TTL);
        // TODO: 이메일 발송은 다음 단계에서 연결
    }

    public boolean confirmEmailVerification(String email, String code) {
        String savedCode = stringRedisTemplate.opsForValue().get(verificationKey(email));

        if (savedCode == null) {
            throw new BusinessException(MemberErrorCode.VERIFICATION_CODE_EXPIRED);
        }

        return savedCode.equals(code);
    }

    private String verificationKey(String email) {
        return "email-verification:" + email;
    }

    private String generateVerificationCode() {
        int code = new Random().nextInt(1_000_000);
        return String.format("%06d", code);
    }

    public boolean checkNicknameAvailability(String nickname) {
        return !memberRepository.existsByNickname(nickname);
    }
}

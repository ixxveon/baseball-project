package kr.co.winningpick.domain.member.service;

import kr.co.winningpick.domain.member.dto.request.RequestSignup;
import kr.co.winningpick.domain.member.dto.response.ResponseSignup;
import kr.co.winningpick.domain.member.entity.Member;
import kr.co.winningpick.domain.member.exception.MemberErrorCode;
import kr.co.winningpick.domain.member.repository.MemberRepository;
import kr.co.winningpick.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MemberService {

    private static final Duration VERIFICATION_CODE_TTL = Duration.ofMinutes(5);

    private static final Duration VERIFIED_STATUS_TTL = Duration.ofMinutes(30);

    private final StringRedisTemplate stringRedisTemplate;

    private final MemberRepository memberRepository;

    private final PasswordEncoder passwordEncoder;

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

        boolean verified = savedCode.equals(code);
        if (verified) {
            stringRedisTemplate.opsForValue().set(verifiedKey(email), "true", VERIFIED_STATUS_TTL);
        }

        return verified;
    }

    private String verifiedKey(String email) {
        return "email-verified:" + email;
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

    public ResponseSignup signup(RequestSignup request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new BusinessException(MemberErrorCode.DUPLICATE_EMAIL);
        }
        if (memberRepository.existsByNickname(request.nickname())) {
            throw new BusinessException(MemberErrorCode.DUPLICATE_NICKNAME);
        }

        String verified =
                stringRedisTemplate.opsForValue().get(verifiedKey(request.email()));
        if (verified == null) {
            throw new BusinessException(MemberErrorCode.EMAIL_NOT_VERIFIED);
        }

        Member member = Member.createLocalMember(request.email(), request.nickname(), passwordEncoder.encode(request.password()));
        Member savedMember = memberRepository.save(member);

        return new ResponseSignup(savedMember.getId(), savedMember.getEmail(), savedMember.getNickname());
    }
}

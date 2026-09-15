package kr.co.winningpick.domain.member.service;

import kr.co.winningpick.domain.member.dto.request.RequestLogin;
import kr.co.winningpick.domain.member.dto.request.RequestSignup;
import kr.co.winningpick.domain.member.dto.response.ResponseLogin;
import kr.co.winningpick.domain.member.dto.response.ResponseSignup;
import kr.co.winningpick.domain.member.entity.Member;
import kr.co.winningpick.domain.member.exception.MemberErrorCode;
import kr.co.winningpick.domain.member.repository.MemberRepository;
import kr.co.winningpick.global.exception.BusinessException;
import kr.co.winningpick.global.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import kr.co.winningpick.domain.member.dto.request.ProfileUpdateRequest;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class MemberService {

    private static final Duration VERIFICATION_CODE_TTL = Duration.ofMinutes(5);
    private static final Duration VERIFIED_STATUS_TTL = Duration.ofMinutes(30);
    private final StringRedisTemplate stringRedisTemplate;
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    // 👇 서버가 켜질 때 자동으로 실행되어 테스트용 1번 회원을 만들어주는 마법의 코드입니다.
    @jakarta.annotation.PostConstruct
    public void initTestUser() {
        // 데이터베이스에 회원이 한 명도 없을 때만 실행
        if (memberRepository.count() == 0) {
            kr.co.winningpick.domain.member.entity.Member dummyUser =
                    kr.co.winningpick.domain.member.entity.Member.createLocalMember("test@test.com", "기존승요", "1234");
            memberRepository.save(dummyUser);
        }
    }

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

    public ResponseLogin login(RequestLogin request) {
        Member member = memberRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(MemberErrorCode.LOGIN_FAILED));

        if (!passwordEncoder.matches(request.password(), member.getPassword())) {
            throw new BusinessException(MemberErrorCode.LOGIN_FAILED);
        }

        String accessToken = jwtProvider.createAccessToken(member.getId());
        LocalDateTime expiresAt = LocalDateTime.now().plus(jwtProvider.getAccessTokenValidity());

        return new ResponseLogin(accessToken, expiresAt);
    }

    @Transactional
    public void updateProfile(Long memberId, ProfileUpdateRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
        // (만약 MemberErrorCode.MEMBER_NOT_FOUND 같은 에러 코드가 있다면 BusinessException으로 교체하셔도 좋습니다.)

        // 1. 닉네임 변경 (입력값이 있고, 기존 닉네임과 다를 경우에만 실행)
        if (request.nickname() != null && !request.nickname().equals(member.getNickname())) {
            // 친구분이 만들어둔 예외 처리 코드 활용
            if (memberRepository.existsByNickname(request.nickname())) {
                throw new BusinessException(MemberErrorCode.DUPLICATE_NICKNAME);
            }
            member.changeNickname(request.nickname());
        }

        // 2. 최애 구단 변경
        if (request.favoriteTeamId() != null) {
            member.changeFavoriteTeam(request.favoriteTeamId());
        }

        // 3. 알림 설정 변경
        if (request.pushAlarm() != null) {
            member.changePushAlarm(request.pushAlarm());
        }
    }


}

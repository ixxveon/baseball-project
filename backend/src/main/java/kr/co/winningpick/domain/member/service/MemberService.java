package kr.co.winningpick.domain.member.service;

import kr.co.winningpick.domain.member.dto.request.RequestLogin;
import kr.co.winningpick.domain.member.dto.request.RequestResetPassword;
import kr.co.winningpick.domain.member.dto.request.RequestSignup;
import kr.co.winningpick.domain.member.dto.response.ResponseLogin;
import kr.co.winningpick.domain.member.dto.response.ResponseMyInfo;
import kr.co.winningpick.domain.member.dto.response.ResponseReissue;
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
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Profile;
import org.springframework.beans.factory.annotation.Value;
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
    @Value("${spring.profiles.active:}")
    private String activeProfile; //로컬환경에서만 실행
    @PostConstruct
    public void initTestUser() {
        // 👇 3. 현재 환경이 "local"일 때만, 그리고 회원이 없을 때만 실행되도록 if문으로 꽉 묶었습니다.
        if ("local".equals(activeProfile) && memberRepository.count() == 0) {
            Member dummyUser = Member.createLocalMember("test@test.com", "기존승요", passwordEncoder.encode("1234"));
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
        String refreshToken = jwtProvider.createRefreshToken(member.getId());
        stringRedisTemplate.opsForValue().set(
                refreshTokenKey(member.getId()),refreshToken, jwtProvider.getRefreshTokenValidity());


        return new ResponseLogin(accessToken, expiresAt, refreshToken);
    }

    public ResponseReissue reissue(String refreshToken) {
        Long memberId;
        try {
            memberId = jwtProvider.getMemberId(refreshToken);
        } catch (Exception e) {
            throw new BusinessException(MemberErrorCode.INVALID_REFRESH_TOKEN);
        }

        String savedToken = stringRedisTemplate.opsForValue().get(refreshTokenKey(memberId));
        if (savedToken == null || !savedToken.equals(refreshToken)) {
            throw new BusinessException(MemberErrorCode.INVALID_REFRESH_TOKEN);
        }

        String newAccessToken = jwtProvider.createAccessToken(memberId);
        LocalDateTime expiresAt = LocalDateTime.now().plus(jwtProvider.getAccessTokenValidity());
        return new ResponseReissue(newAccessToken, expiresAt);
    }

    public ResponseMyInfo getMyInfo(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(MemberErrorCode.MEMBER_NOT_FOUND));
        return ResponseMyInfo.from(member);
    }

    public void logout(Long memberId) {
        stringRedisTemplate.delete(refreshTokenKey(memberId));
    }

    private String refreshTokenKey(Long memberId) {
        return "refresh-token:" + memberId;
    }

    @Transactional
    public void updateProfile(Long memberId, ProfileUpdateRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BusinessException(MemberErrorCode.MEMBER_NOT_FOUND));

        // 1. 닉네임 변경 (입력값이 있고, 기존 닉네임과 다를 경우에만 실행)
        if (request.nickname() != null && !request.nickname().equals(member.getNickname())) {

            if (memberRepository.existsByNickname(request.nickname())) {
                throw new BusinessException(MemberErrorCode.DUPLICATE_NICKNAME);
            }
            member.changeNickname(request.nickname());
        }

        // 2. 최애 구단 변경 (teamRepository 대신 숫자 범위로 검사)
        if (request.favoriteTeamId() != null) {
            // 한국 프로야구 구단(1~10번) 범위를 벗어나면 에러 발생
            if (request.favoriteTeamId() < 1 || request.favoriteTeamId() > 10) {
                throw new BusinessException(MemberErrorCode.INVALID_TEAM_ID);
            }
            // 2. 검사를 무사히 통과했을 때만 회원 정보 업데이트
            member.changeFavoriteTeam(request.favoriteTeamId());
        }

        // 3. 알림 설정 변경
        if (request.pushAlarm() != null) {
            member.changePushAlarm(request.pushAlarm());
        }
    }


    @Transactional
    public void resetPassword(RequestResetPassword request) {
        String verified = stringRedisTemplate.opsForValue().get(verifiedKey(request.email()));
        if (verified == null) {
            throw new BusinessException(MemberErrorCode.EMAIL_NOT_VERIFIED);
        }

        Member member = memberRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(MemberErrorCode.LOGIN_FAILED));

        member.changePassword(passwordEncoder.encode(request.newPassword()));
    }
}

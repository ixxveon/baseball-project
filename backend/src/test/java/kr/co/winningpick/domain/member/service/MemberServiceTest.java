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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Duration;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MemberServiceTest {

    @Mock
    private StringRedisTemplate stringRedisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @Mock
    private MemberRepository memberRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtProvider jwtProvider;

    @InjectMocks
    private MemberService memberService;

    @Test
    void 인증번호를_발송하면_Redis에_저장한다() {
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);

        memberService.sendEmailVerification("test@example.com");

        verify(valueOperations).set(eq("email-verification:test@example.com"), anyString(), any(Duration.class));
    }

    @Test
    void 저장된_코드와_일치하면_true를_반환한다() {
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("email-verification:test@example.com")).thenReturn("123456");

        boolean result = memberService.confirmEmailVerification("test@example.com", "123456");

        assertThat(result).isTrue();
    }

    @Test
    void 저장된_코드와_다르면_false를_반환한다() {
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("email-verification:test@example.com")).thenReturn("123456");

        boolean result = memberService.confirmEmailVerification("test@example.com", "000000");

        assertThat(result).isFalse();
    }

    @Test
    void 저장된_코드가_없으면_예외를_던진다() {
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("email-verification:test@example.com")).thenReturn(null);

        assertThatThrownBy(() -> memberService.confirmEmailVerification("test@example.com", "123456"))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", MemberErrorCode.VERIFICATION_CODE_EXPIRED);
    }

    @Test
    void 이메일이_중복되면_예외를_던진다() {
        RequestSignup request = new RequestSignup("test@example.com", "nickname", "rawPassword");
        when(memberRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThatThrownBy(() -> memberService.signup(request))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", MemberErrorCode.DUPLICATE_EMAIL);
    }

    @Test
    void 닉네임이_중복되면_예외를_던진다() {
        RequestSignup request = new RequestSignup("test@example.com", "nickname", "rawPassword");
        when(memberRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(memberRepository.existsByNickname("nickname")).thenReturn(true);

        assertThatThrownBy(() -> memberService.signup(request))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", MemberErrorCode.DUPLICATE_NICKNAME);
    }

    @Test
    void 이메일_인증이_안됐으면_예외를_던진다() {
        RequestSignup request = new RequestSignup("test@example.com", "nickname", "rawPassword");
        when(memberRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(memberRepository.existsByNickname("nickname")).thenReturn(false);
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("email-verified:test@example.com")).thenReturn(null);

        assertThatThrownBy(() -> memberService.signup(request))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", MemberErrorCode.EMAIL_NOT_VERIFIED);
    }

    @Test
    void 정상적으로_회원가입하면_회원정보를_반환한다() {
        RequestSignup request = new RequestSignup("test@example.com", "nickname", "rawPassword");
        when(memberRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(memberRepository.existsByNickname("nickname")).thenReturn(false);
        when(stringRedisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("email-verified:test@example.com")).thenReturn("true");
        when(passwordEncoder.encode("rawPassword")).thenReturn("encodedPassword");

        Member savedMember = Member.createLocalMember("test@example.com", "nickname", "encodedPassword");
        ReflectionTestUtils.setField(savedMember, "id", 1L);
        when(memberRepository.save(any(Member.class))).thenReturn(savedMember);

        ResponseSignup response = memberService.signup(request);

        assertThat(response.userId()).isEqualTo(1L);
        assertThat(response.email()).isEqualTo("test@example.com");
        assertThat(response.nickname()).isEqualTo("nickname");
    }

    @Test
    void 존재하지_않는_이메일이면_예외를_던진다() {
        when(memberRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> memberService.login(new RequestLogin("test@example.com", "rawPassword")))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", MemberErrorCode.LOGIN_FAILED);
    }

    @Test
    void 비밀번호가_틀리면_예외를_던진다() {
        Member member = Member.createLocalMember("test@example.com", "nickname", "encodedPassword");
        when(memberRepository.findByEmail("test@example.com")).thenReturn(Optional.of(member));
        when(passwordEncoder.matches("wrongPassword", "encodedPassword")).thenReturn(false);

        assertThatThrownBy(() -> memberService.login(new RequestLogin("test@example.com", "wrongPassword")))
                .isInstanceOf(BusinessException.class)
                .hasFieldOrPropertyWithValue("errorCode", MemberErrorCode.LOGIN_FAILED);
    }

    @Test
    void 정상적으로_로그인하면_토큰을_반환한다() {
        Member member = Member.createLocalMember("test@example.com", "nickname", "encodedPassword");
        ReflectionTestUtils.setField(member, "id", 1L);
        when(memberRepository.findByEmail("test@example.com")).thenReturn(Optional.of(member));
        when(passwordEncoder.matches("rawPassword", "encodedPassword")).thenReturn(true);
        when(jwtProvider.createAccessToken(1L)).thenReturn("access-token");
        when(jwtProvider.getAccessTokenValidity()).thenReturn(Duration.ofHours(1));

        ResponseLogin response = memberService.login(new RequestLogin("test@example.com", "rawPassword"));

        assertThat(response.accessToken()).isEqualTo("access-token");
    }
}

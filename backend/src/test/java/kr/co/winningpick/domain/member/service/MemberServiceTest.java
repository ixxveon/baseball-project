package kr.co.winningpick.domain.member.service;

import kr.co.winningpick.domain.member.exception.MemberErrorCode;
import kr.co.winningpick.global.exception.BusinessException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.time.Duration;

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
}
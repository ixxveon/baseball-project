package kr.co.winningpick.domain.member.oauth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.winningpick.domain.member.entity.Member;
import kr.co.winningpick.domain.member.repository.MemberRepository;
import kr.co.winningpick.domain.member.type.ProviderType;
import kr.co.winningpick.global.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String socialId = oAuth2User.getAttribute("sub");

        Member member = memberRepository.findBySocialIdAndProvider(socialId, ProviderType.GOOGLE)
                .orElseThrow(() -> new IllegalStateException("소셜 로그인 처리 중 회원을 찾을 수 없습니다."));

        String accessToken = jwtProvider.createAccessToken(member.getId());

        response.sendRedirect("http://localhost:5173/oauth/callback?accessToken=" + accessToken);
    }
}

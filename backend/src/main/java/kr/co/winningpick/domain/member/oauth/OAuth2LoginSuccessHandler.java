package kr.co.winningpick.domain.member.oauth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import kr.co.winningpick.domain.member.entity.Member;
import kr.co.winningpick.domain.member.repository.MemberRepository;
import kr.co.winningpick.domain.member.type.ProviderType;
import kr.co.winningpick.global.util.JwtProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();

        ProviderType provider = ProviderType.valueOf(registrationId.toUpperCase());
        String socialId = extractSocialId(oAuth2User, provider);

        Member member = memberRepository.findBySocialIdAndProvider(socialId, provider)
                .orElseThrow(() -> new IllegalStateException("소셜 로그인 처리 중 회원을 찾을 수 없습니다."));

        String accessToken = jwtProvider.createAccessToken(member.getId());

        response.sendRedirect("http://localhost:5173/oauth/callback?accessToken=" + accessToken);
    }

    private String extractSocialId(OAuth2User oAuth2User, ProviderType provider) {
        if (provider == ProviderType.GOOGLE) {
            return oAuth2User.getAttribute("sub");
        }
        if (provider == ProviderType.NAVER) {
            Map<String, Object> response = oAuth2User.getAttribute("response");
            return (String) response.get("id");
        }
        Object id = oAuth2User.getAttribute("id");
        return String.valueOf(id);
    }

}

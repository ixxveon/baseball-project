package kr.co.winningpick.domain.member.oauth;

import kr.co.winningpick.domain.member.entity.Member;
import kr.co.winningpick.domain.member.repository.MemberRepository;
import kr.co.winningpick.domain.member.type.ProviderType;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * 구글을 제외한(OIDC가 아닌) 소셜 로그인 제공자를 처리한다.
 * Spring Security는 OIDC가 아닌 provider를 전부 이 서비스 하나로 라우팅하므로, registrationId로 분기한다.
 */
@Service
@RequiredArgsConstructor
public class SocialOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        if ("naver".equals(registrationId)) {
            loadNaverUser(oAuth2User);
        } else {
            loadKakaoUser(oAuth2User);
        }

        return oAuth2User;
    }

    private void loadKakaoUser(OAuth2User oAuth2User) {
        Object idAttribute = oAuth2User.getAttribute("id");
        String socialId = String.valueOf(idAttribute);

        Map<String, Object> kakaoAccount = oAuth2User.getAttribute("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String rawEmail = (String) kakaoAccount.get("email");
        String email = (rawEmail != null) ? rawEmail : "kakao_" + socialId + "@winningpick.local";
        String nickname = (String) profile.get("nickname");

        memberRepository.findBySocialIdAndProvider(socialId, ProviderType.KAKAO)
                .orElseGet(() -> memberRepository.save(Member.createSocialMember(email, nickname, ProviderType.KAKAO, socialId)));
    }

    private void loadNaverUser(OAuth2User oAuth2User) {
        Map<String, Object> response = oAuth2User.getAttribute("response");

        String socialId = (String) response.get("id");
        String email = (String) response.get("email");
        String nickname = (String) response.get("name");

        memberRepository.findBySocialIdAndProvider(socialId, ProviderType.NAVER)
                .orElseGet(() -> memberRepository.save(Member.createSocialMember(email, nickname, ProviderType.NAVER, socialId)));
    }
}

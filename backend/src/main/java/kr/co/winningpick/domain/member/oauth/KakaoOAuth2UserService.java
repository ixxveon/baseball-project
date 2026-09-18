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

@Service
@RequiredArgsConstructor
public class KakaoOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        Object idAttribute = oAuth2User.getAttribute("id");
        String socialId = String.valueOf(idAttribute);

        Map<String, Object> kakaoAccount = oAuth2User.getAttribute("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String rawEmail = (String) kakaoAccount.get("email");
        String email = (rawEmail != null) ? rawEmail : "kakao_" + socialId + "@winningpick.local";
        String nickname = (String) profile.get("nickname");

        memberRepository.findBySocialIdAndProvider(socialId, ProviderType.KAKAO)
                .orElseGet(() -> memberRepository.save(Member.createSocialMember(email, nickname, ProviderType.KAKAO, socialId)));

        return oAuth2User;
    }
}
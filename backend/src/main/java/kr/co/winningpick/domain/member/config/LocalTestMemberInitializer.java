package kr.co.winningpick.domain.member.config;

import kr.co.winningpick.domain.member.entity.Member;
import kr.co.winningpick.domain.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@Profile("local")
@RequiredArgsConstructor
public class LocalTestMemberInitializer implements ApplicationRunner {

    private static final String TEST_EMAIL = "test@test.com";
    private static final String TEST_NICKNAME = "기존승요";
    private static final String TEST_PASSWORD = "1234";

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (memberRepository.existsByEmail(TEST_EMAIL)) {
            return;
        }
        Member testMember = Member.createLocalMember(TEST_EMAIL, TEST_NICKNAME, passwordEncoder.encode(TEST_PASSWORD));
        memberRepository.save(testMember);
        log.info("로컬 테스트 회원을 생성했습니다. email={}", TEST_EMAIL);
    }
}
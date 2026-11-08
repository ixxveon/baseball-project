package kr.co.winningpick.domain.member.service;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LoggingVerificationCodeSender implements VerificationCodeSender {

    @Override
    public void send(String email, String code) {
        log.warn("메일 설정이 없어 인증번호를 로그로 출력합니다. email={}, code={}", email,code);
    }
}

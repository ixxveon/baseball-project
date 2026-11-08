package kr.co.winningpick.domain.member.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@RequiredArgsConstructor
public class SmtpVerificationCodeSender implements VerificationCodeSender {

    private static final String SUBJECT = "[위닝픽] 이메일 인증번호 안내";

    private final JavaMailSender mailSender;
    private final String from;

    @Override
    public void send(String email, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(email);
        message.setSubject(SUBJECT);
        message.setText("인증번호는 [" + code + "] 입니다. \n5분 안에 입력해주세요.");
        mailSender.send(message);
    }
}

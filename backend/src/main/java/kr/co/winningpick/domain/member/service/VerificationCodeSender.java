package kr.co.winningpick.domain.member.service;

public interface VerificationCodeSender {

    void send(String email, String code);
}

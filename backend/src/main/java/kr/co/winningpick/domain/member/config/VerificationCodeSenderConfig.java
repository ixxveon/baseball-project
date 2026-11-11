package kr.co.winningpick.domain.member.config;

import kr.co.winningpick.domain.member.service.LoggingVerificationCodeSender;
import kr.co.winningpick.domain.member.service.SmtpVerificationCodeSender;
import kr.co.winningpick.domain.member.service.VerificationCodeSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;

@Configuration
public class VerificationCodeSenderConfig {

    @Bean
    public VerificationCodeSender verificationCodeSender(ObjectProvider<JavaMailSender> mailSenderProvider,
                                                         @Value("${spring.mail.username:}") String from) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            return new LoggingVerificationCodeSender();
        }
        return new SmtpVerificationCodeSender(mailSender, from);
    }
}

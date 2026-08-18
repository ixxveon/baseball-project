package kr.co.winningpick;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class WinningPickApplication {

    public static void main(String[] args) {
        SpringApplication.run(WinningPickApplication.class, args);
    }
}

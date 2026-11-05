package kr.co.winningpick.domain.member.dto.response;

import kr.co.winningpick.domain.member.entity.Member;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

public record ResponseMyInfo(
        Long id,
        String email,
        String nickname,
        Long favoriteTeamId,
        boolean pushAlarmEnabled,
        LocalDateTime createdAt) {

    public static ResponseMyInfo from(Member member) {
        return new ResponseMyInfo(
                member.getId(),
                member.getEmail(),
                member.getNickname(),
                member.getFavoriteTeamId(),
                member.isPushAlarmEnabled(),
                member.getCreatedAt()
        );
    }
}

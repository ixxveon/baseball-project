package kr.co.winningpick.domain.member.dto.response;

import kr.co.winningpick.domain.member.entity.Member;

public record ResponseMyInfo(Long id, String email, String nickname) {

    public static ResponseMyInfo from(Member member) {
        return new ResponseMyInfo(member.getId(), member.getEmail(), member.getNickname());
    }
}

package kr.co.winningpick.domain.member.entity;

import jakarta.persistence.*;
import kr.co.winningpick.domain.member.type.MemberStatus;
import kr.co.winningpick.domain.member.type.ProviderType;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "favorite_team_id")
    private Long favoriteTeamId;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(nullable = false, unique = true, length = 50)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ProviderType provider;

    @Column(name = "push_alarm_enabled", nullable = false)
    private boolean pushAlarmEnabled;

    @Column(name = "social_id", length = 255)
    private String socialId;

    @Column(length = 255)
    private String password;

    // DB 레벨 default를 둬야 하는 이유: 이미 유저 데이터가 있는 DB에 이 컬럼이 새로 추가될 때
    // (배포된 DB, 팀원 로컬 postgres 등) default 없이 NOT NULL로 추가하면 기존 행 때문에 컬럼 추가 자체가 실패한다.
    // data.sql 시드 INSERT문도 이 컬럼을 명시하지 않으므로 DB default가 필요하다.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20, columnDefinition = "varchar(20) default 'ACTIVE'")
    private MemberStatus status = MemberStatus.ACTIVE;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public void changeFavoriteTeam(Long teamId) {
        this.favoriteTeamId = teamId;
    }

    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    public void changePushAlarm(boolean enabled) {
        this.pushAlarmEnabled = enabled;
    }

    public void changePassword(String encodedPassword) {
        this.password = encodedPassword;
    }

    public boolean isWithdrawn() {
        return this.status == MemberStatus.WITHDRAWN;
    }

    // 탈퇴해도 이 회원이 쓴 게시글/댓글은 남기되, 작성자 표시는 익명으로 바꾼다.
    // email/nickname은 unique 제약이 있어서 그대로 두면 같은 이메일/닉네임으로 재가입이 막히므로,
    // 탈퇴 시점에 본인 id로만 유일한 값으로 바꿔 원래 값을 비워준다.
    public void withdraw() {
        this.status = MemberStatus.WITHDRAWN;
        this.email = "withdrawn_" + this.id + "@winningpick.local";
        this.nickname = "withdrawn_" + this.id;
        this.password = null;
        this.socialId = null;
    }

    public String getDisplayNickname() {
        return isWithdrawn() ? "탈퇴한 회원" : this.nickname;
    }

    public static Member createLocalMember(String email, String nickname, String encodedPassword) {
        Member member = new Member();
        member.email = email;
        member.nickname = nickname;
        member.password = encodedPassword;
        member.provider = ProviderType.LOCAL;
        member.pushAlarmEnabled = false;
        return member;
    }

    public static Member createSocialMember(String email, String nickname, ProviderType provider, String socialId) {
        Member member = new Member();
        member.email = email;
        member.nickname = nickname;
        member.provider = provider;
        member.socialId = socialId;
        member.pushAlarmEnabled = false;
        return member;
    }
}

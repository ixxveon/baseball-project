package kr.co.winningpick.domain.member.entity;

import jakarta.persistence.*;
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

}

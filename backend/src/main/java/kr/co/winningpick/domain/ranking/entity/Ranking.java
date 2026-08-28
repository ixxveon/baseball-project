package kr.co.winningpick.domain.ranking.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rankings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Ranking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 데이터베이스 고유 번호

    private Integer teamRank; // 순위 (rank는 예약어일 수 있어 teamRank로 사용)
    private String teamName;  // 팀명
    private Integer games;    // 경기 수
    private Integer wins;     // 승
    private Integer draws;    // 무
    private Integer losses;   // 패
    private String winRate;   // 승률
    private String gameDiff;  // 게임차
    private String streak;    // 최근 흐름 (연승/연패)
}
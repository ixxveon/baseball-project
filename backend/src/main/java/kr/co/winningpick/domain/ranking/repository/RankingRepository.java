package kr.co.winningpick.domain.ranking.repository;

import kr.co.winningpick.domain.ranking.entity.Ranking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RankingRepository extends JpaRepository<Ranking, Long> {

    // 팀 이름으로 기존 순위 정보 찾기 (업데이트용)
    Optional<Ranking> findByTeamName(String teamName);

    // 1위부터 10위까지 순위순 정렬 조회
    List<Ranking> findAllByOrderByTeamRankAsc();
}
package kr.co.winningpick.domain.ranking.repository;

import kr.co.winningpick.domain.ranking.entity.Ranking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RankingRepository extends JpaRepository<Ranking, Long> {
    // 순위(teamRank)를 기준으로 오름차순(1위부터) 정렬해서 가져오는 명령어입니다!
    List<Ranking> findAllByOrderByTeamRankAsc();
}
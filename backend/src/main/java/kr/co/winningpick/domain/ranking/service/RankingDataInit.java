package kr.co.winningpick.domain.ranking.service;

import jakarta.annotation.PostConstruct;
import kr.co.winningpick.domain.ranking.entity.Ranking;
import kr.co.winningpick.domain.ranking.repository.RankingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class RankingDataInit {

    private final RankingRepository rankingRepository;

    @PostConstruct
    @Transactional
    public void init() {

        if (rankingRepository.count() > 0) {
            return;
        }

        try {
            rankingRepository.save(Ranking.builder().teamRank(1).teamName("KIA 타이거즈").games(144).wins(87).draws(2).losses(55).winRate(0.613).gameDiff(0.0).streak("2승").build());
            rankingRepository.save(Ranking.builder().teamRank(2).teamName("삼성 라이온즈").games(144).wins(78).draws(2).losses(64).winRate(0.549).gameDiff(9.0).streak("1패").build());
            rankingRepository.save(Ranking.builder().teamRank(3).teamName("LG 트윈스").games(144).wins(76).draws(2).losses(66).winRate(0.535).gameDiff(11.0).streak("1승").build());

        } catch (DataIntegrityViolationException e) {
            // 👈 추가: 다른 서버가 먼저 데이터를 넣어서 중복 에러가 났을 때 무시하고 정상 구동되도록 처리
            log.info("이미 다른 서버에서 랭킹 데이터가 초기화되었습니다.");

        }
    }
}


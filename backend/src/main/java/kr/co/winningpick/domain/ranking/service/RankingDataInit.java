package kr.co.winningpick.domain.ranking.service;

import jakarta.annotation.PostConstruct;
import kr.co.winningpick.domain.ranking.entity.Ranking;
import kr.co.winningpick.domain.ranking.repository.RankingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RankingDataInit {

    private final RankingRepository rankingRepository;

    // 서버가 켜질 때 이 @PostConstruct 안의 코드가 자동으로 딱 한 번 실행됩니다!
    @PostConstruct
    public void init() {
        // 냉장고(DB)에 이미 데이터가 있으면 안 넣고, 비어있을 때만 데이터를 채웁니다.
        if (rankingRepository.count() > 0) {
            return;
        }

        // 1위 KIA, 2위 삼성, 3위 LG 데이터를 냉장고에 쏙쏙 저장!
        rankingRepository.save(Ranking.builder().teamRank(1).teamName("KIA 타이거즈").games(144).wins(87).draws(2).losses(55).winRate("0.613").gameDiff("0.0").streak("2승").build());
        rankingRepository.save(Ranking.builder().teamRank(2).teamName("삼성 라이온즈").games(144).wins(78).draws(2).losses(64).winRate("0.549").gameDiff("9.0").streak("1패").build());
        rankingRepository.save(Ranking.builder().teamRank(3).teamName("LG 트윈스").games(144).wins(76).draws(2).losses(66).winRate("0.535").gameDiff("11.0").streak("1승").build());
    }
}
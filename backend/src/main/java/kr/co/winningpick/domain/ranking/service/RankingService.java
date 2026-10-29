package kr.co.winningpick.domain.ranking.service;

import kr.co.winningpick.domain.ranking.dto.response.ResponseRanking;
import kr.co.winningpick.domain.ranking.repository.RankingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingService {

    private final RankingRepository rankingRepository;

    public List<ResponseRanking> getRankings() {
        return rankingRepository.findAllByOrderByTeamRankAsc().stream()
                .map(ResponseRanking::from)
                .toList();
    }
}
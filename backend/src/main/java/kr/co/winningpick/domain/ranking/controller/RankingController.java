package kr.co.winningpick.domain.ranking.controller;

import kr.co.winningpick.domain.ranking.docs.RankingControllerDocs;
import kr.co.winningpick.domain.ranking.dto.response.ResponseRanking;
import kr.co.winningpick.domain.ranking.service.RankingService;
import kr.co.winningpick.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rankings") // 프론트엔드가 찌를 주소!
@RequiredArgsConstructor
public class RankingController implements RankingControllerDocs {

    private final RankingService rankingService;

    @Override
    @GetMapping
    public ResponseEntity<ApiResponse<List<ResponseRanking>>> getRankings() {
        List<ResponseRanking> rankings = rankingService.getRankings();
        return ResponseEntity.ok(ApiResponse.success(rankings));
    }
}
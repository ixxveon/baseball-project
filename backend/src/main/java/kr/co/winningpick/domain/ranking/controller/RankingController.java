package kr.co.winningpick.domain.ranking.controller;

import kr.co.winningpick.domain.ranking.dto.response.ResponseRanking;
import kr.co.winningpick.domain.ranking.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rankings") // 프론트엔드가 찌를 주소!
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RankingController {

    private final RankingService rankingService;

    @GetMapping
    public ResponseEntity<List<ResponseRanking>> getRankings() {
        List<ResponseRanking> rankings = rankingService.getRankings();
        return ResponseEntity.ok(rankings); // 요리된 데이터를 프론트(손님)에게 내어줍니다!
    }
}
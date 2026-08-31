package kr.co.winningpick.domain.ranking.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.winningpick.domain.ranking.dto.response.ResponseRanking;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "랭킹 API", description = "팀 순위 관련 API")
public interface RankingControllerDocs {

    @Operation(summary = "랭킹 조회", description = "1위부터 순서대로 정렬된 팀 랭킹 정보를 조회합니다.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "랭킹 조회 성공")
    })
    ResponseEntity<List<ResponseRanking>> getRankings();
}
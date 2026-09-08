package kr.co.winningpick.domain.ranking.docs;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
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
            @ApiResponse(responseCode = "200", description = "랭킹 조회 성공"),

            @ApiResponse(
                    responseCode = "404",
                    description = "랭킹 데이터가 비어있음",
                    content = @Content(
                            mediaType = "application/json",
                            examples = @ExampleObject(
                                    name = "EmptyRanking",
                                    summary = "랭킹 데이터 없음",
                                    value = "{\n  \"status\": 404,\n  \"message\": \"현재 등록된 랭킹 데이터가 없습니다.\"\n}"
                            )
                    )
            )

    })
    ResponseEntity<kr.co.winningpick.global.response.ApiResponse<List<ResponseRanking>>> getRankings();
}
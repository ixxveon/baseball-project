package kr.co.winningpick.domain.calendar.docs;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.co.winningpick.domain.calendar.dto.ResponseCalendarGame;
import org.springframework.http.ResponseEntity;

import java.util.List;

@Tag(name = "Calendar", description = "캘린더 및 직관 추천 API")
public interface CalendarControllerDocs {

    @Operation(
            summary = "월별 직관 추천 경기 조회",
            description = "특정 팀과 연월을 받아 직관 추천 경기 목록을 조회합니다. (AI 예측이 없는 경기는 점수와 날씨가 null로 반환됩니다.)"
    )
    @ApiResponse(responseCode = "200", description = "직관 추천 캘린더 조회 성공")
    ResponseEntity<kr.co.winningpick.global.response.ApiResponse<List<ResponseCalendarGame>>> getRecommendedGames(
            @Parameter(description = "응원 팀 이름 (예: LG, KIA, 삼성 등)", example = "LG")
            String teamName,

            @Parameter(description = "조회 연월 (예: 2026-12)", example = "2026-12")
            String yearMonth
    );
}
package kr.co.winningpick.domain.calendar.controller;

import kr.co.winningpick.domain.calendar.docs.CalendarControllerDocs; // 👈 임포트 추가
import kr.co.winningpick.domain.calendar.dto.ResponseCalendarGame;
import kr.co.winningpick.domain.calendar.service.CalendarService;
import kr.co.winningpick.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/calendar")
@RequiredArgsConstructor
public class CalendarController implements CalendarControllerDocs { // 👈 인터페이스 구현

    private final CalendarService calendarService;

    @Override // 👈 오버라이드 추가
    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<ResponseCalendarGame>>> getRecommendedGames(
            @RequestParam String teamName,
            @RequestParam String yearMonth
    ) {
        List<ResponseCalendarGame> games = calendarService.getRecommendedGames(teamName, yearMonth);
        return ResponseEntity.ok(ApiResponse.success(games));
    }
}
package kr.co.winningpick.domain.calendar.controller;

import kr.co.winningpick.domain.calendar.dto.CalendarGameResponse;
import kr.co.winningpick.domain.calendar.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/calendar")
@RequiredArgsConstructor
public class CalendarController {

    private final CalendarService calendarService;

    @GetMapping("/recommendations")
    public ResponseEntity<List<CalendarGameResponse>> getDirectRecommendations(
            @RequestParam String teamName,
            @RequestParam String yearMonth
    ) {
        List<CalendarGameResponse> responses = calendarService.getRecommendedGames(teamName, yearMonth);
        return ResponseEntity.ok(responses);
    }
}
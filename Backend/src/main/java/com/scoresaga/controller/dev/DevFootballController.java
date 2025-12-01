package com.scoresaga.controller.dev;

import com.scoresaga.service.external.FootballApiClient;
import com.scoresaga.service.external.dto.ExternalFixture;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dev/football")
@RequiredArgsConstructor
public class DevFootballController {

    private final FootballApiClient footballApiClient;

    // GET /api/dev/football/today
    @GetMapping("/today")
    public List<ExternalFixture> getTodayPremierLeagueFixtures() {
        // Premier League code = "PL"
        return footballApiClient.getUpcomingFixtures(LocalDate.now(), List.of("PL"));
    }
}

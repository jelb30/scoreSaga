package com.scoresaga.controller;

import com.scoresaga.dto.MatchDto;
import com.scoresaga.model.Match;
import com.scoresaga.model.MatchStatus;
import com.scoresaga.model.Sport;
import com.scoresaga.repository.MatchRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchRepository matchRepository;

    public MatchController(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    @GetMapping
    public List<MatchDto> getMatches(
            @RequestParam Sport sport,
            @RequestParam(required = false, defaultValue = "UPCOMING") MatchStatus status
    ) {
        List<Match> matches = matchRepository.findBySportAndStatusOrderByStartTimeAsc(sport, status);
        return matches.stream()
                .map(this::toDto)
                .toList();
    }

    private MatchDto toDto(Match m) {
        return new MatchDto(
                m.getId(),
                m.getSport().name(),
                m.getHomeTeam(),
                m.getAwayTeam(),
                m.getStartTime(),
                m.getStatus().name()
        );
    }
}

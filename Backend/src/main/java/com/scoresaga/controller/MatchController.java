package com.scoresaga.controller;

import com.scoresaga.dto.MatchDto;
import com.scoresaga.model.Match;
import com.scoresaga.model.enums.MatchStatus;
import com.scoresaga.model.enums.Sport;
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
                m.getLeague() != null && m.getLeague().getName() != null
                        ? m.getLeague().getName()
                        : "Unknown League",
                m.getHomeTeam(),
                m.getAwayTeam(),
                m.getHomeScore(),
                m.getAwayScore(),
                m.getStartTime(),
                m.getStatus().name()
        );
    }
}

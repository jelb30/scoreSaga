package com.scoresaga.dto;

import java.time.LocalDateTime;

public record MatchDto(
        Long id,
        String leagueName,
        String homeTeam,
        String awayTeam,
        Integer homeScore,
        Integer awayScore,
        LocalDateTime startTime,
        String status
) {}

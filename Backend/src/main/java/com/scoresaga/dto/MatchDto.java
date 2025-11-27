package com.scoresaga.dto;

import java.time.LocalDateTime;

public record MatchDto(
        Long id,
        String sport,
        String homeTeam,
        String awayTeam,
        LocalDateTime startTime,
        String status
) {}

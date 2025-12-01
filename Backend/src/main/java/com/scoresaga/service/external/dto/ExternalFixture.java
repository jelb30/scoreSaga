package com.scoresaga.service.external.dto;

import java.time.ZonedDateTime;

public record ExternalFixture(
        String externalMatchId,
        String homeTeamId,
        String homeTeamName,
        String awayTeamId,
        String awayTeamName,
        ZonedDateTime startTime,
        String leagueId,
        String leagueName
) {}

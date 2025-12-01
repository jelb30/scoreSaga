package com.scoresaga.service.external;

import com.scoresaga.service.external.dto.ExternalFixture;

import java.time.LocalDate;
import java.util.List;

public interface FootballApiClient {

    /**
     * Fetch upcoming football fixtures for the given date and optional league filter.
     *
     * @param date      date for fixtures (e.g. today)
     * @param leagueIds optional list of league IDs to filter on (can be null or empty for all)
     */
    List<ExternalFixture> getUpcomingFixtures(LocalDate date, List<String> leagueIds);
}

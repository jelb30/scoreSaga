package com.scoresaga.service.external;

import com.scoresaga.service.external.dto.ExternalFixture;

import java.time.LocalDate;
import java.util.List;

public interface FootballApiClient {

    /**
     * Fetch upcoming football fixtures for the given date range and optional league filter.
     *
     * @param startDate start of the fixture window
     * @param endDate   end of the fixture window
     * @param leagueIds optional list of league IDs to filter on (can be null or empty for all)
     */
    List<ExternalFixture> getUpcomingFixtures(LocalDate startDate, LocalDate endDate, List<String> leagueIds);
}

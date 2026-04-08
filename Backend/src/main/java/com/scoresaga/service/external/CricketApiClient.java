package com.scoresaga.service.external;

import com.scoresaga.service.external.dto.ExternalFixture;

import java.time.LocalDate;
import java.util.List;

public interface CricketApiClient {

    /**
     * Fetch upcoming cricket fixtures for the given date range and optional series/league filters.
     */
    List<ExternalFixture> getUpcomingFixtures(LocalDate startDate, LocalDate endDate, List<String> seriesIds);
}

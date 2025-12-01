package com.scoresaga.service.external;

import com.scoresaga.service.external.dto.ExternalFixture;

import java.time.LocalDate;
import java.util.List;

public interface CricketApiClient {

    /**
     * Fetch upcoming cricket fixtures for the given date and optional series/league filters.
     */
    List<ExternalFixture> getUpcomingFixtures(LocalDate date, List<String> seriesIds);
}

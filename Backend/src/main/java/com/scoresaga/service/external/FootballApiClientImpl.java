package com.scoresaga.service.external;

import com.scoresaga.config.ExternalApiProperties;
import com.scoresaga.service.external.api.footballdata.FootballDataMatch;
import com.scoresaga.service.external.api.footballdata.FootballDataMatchesResponse;
import com.scoresaga.service.external.dto.ExternalFixture;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class FootballApiClientImpl implements FootballApiClient {

    private final WebClient.Builder webClientBuilder;
    private final ExternalApiProperties externalApiProperties;

    @Override
    public List<ExternalFixture> getUpcomingFixtures(LocalDate date, List<String> leagueCodes) {
        try {
            WebClient webClient = webClientBuilder
                    .baseUrl(externalApiProperties.getFootball().getBaseUrl())
                    .build();

            FootballDataMatchesResponse apiResponse = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/matches")
                            .queryParam("dateFrom", date.toString())
                            .queryParam("dateTo", date.toString())
                            .build())
                    .header("X-Auth-Token", externalApiProperties.getFootball().getApiKey())
                    .exchangeToMono(resp -> {
                        HttpStatus status = HttpStatus.valueOf(resp.statusCode().value());
                        log.info("Football-Data GET /matches?dateFrom={}&dateTo={} -> status {}", date, date, status);
                        return resp.bodyToMono(FootballDataMatchesResponse.class);
                    })
                    .block();

            if (apiResponse == null || apiResponse.getMatches() == null) {
                return List.of();
            }

            List<ExternalFixture> mapped = mapToExternalFixtures(apiResponse, leagueCodes);
            log.info("Mapped {} football fixtures for {}", mapped.size(), date);
            return mapped;
        } catch (Exception ex) {
            log.warn("Failed to fetch football fixtures: {}", ex.getMessage());
            return Collections.emptyList();
        }
    }

    private List<ExternalFixture> mapToExternalFixtures(FootballDataMatchesResponse apiResponse, List<String> leagueCodes) {
        return apiResponse.getMatches().stream()
                .filter(Objects::nonNull)
                .filter(m -> {
                    if (leagueCodes == null || leagueCodes.isEmpty()) return true;
                    return m.getCompetition() != null && Objects.equals(m.getCompetition().getCode(), leagueCodes.get(0));
                })
                .map(this::toFixture)
                .toList();
    }

    private ExternalFixture toFixture(FootballDataMatch match) {
        return new ExternalFixture(
                match.getId() != null ? String.valueOf(match.getId()) : null,
                match.getHomeTeam() != null ? String.valueOf(match.getHomeTeam().getId()) : null,
                match.getHomeTeam() != null ? match.getHomeTeam().getName() : null,
                match.getAwayTeam() != null ? String.valueOf(match.getAwayTeam().getId()) : null,
                match.getAwayTeam() != null ? match.getAwayTeam().getName() : null,
                match.getUtcDate() != null ? ZonedDateTime.parse(match.getUtcDate()) : null,
                match.getCompetition() != null ? match.getCompetition().getCode() : null,
                match.getCompetition() != null ? match.getCompetition().getName() : null
        );
    }
}

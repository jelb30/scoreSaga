package com.scoresaga.service.external;

import com.scoresaga.config.ExternalApiProperties;
import com.scoresaga.service.external.api.footballdata.FootballDataMatch;
import com.scoresaga.service.external.api.footballdata.FootballDataMatchesResponse;
import com.scoresaga.model.enums.MatchStatus;
import com.scoresaga.service.external.dto.ExternalFixture;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class FootballApiClientImpl implements FootballApiClient {

    private final WebClient.Builder webClientBuilder;
    private final ExternalApiProperties externalApiProperties;

    @Override
    public List<ExternalFixture> getUpcomingFixtures(LocalDate startDate, LocalDate endDate, List<String> leagueCodes) {
        try {
            WebClient webClient = webClientBuilder
                    .baseUrl(externalApiProperties.getFootball().getBaseUrl())
                    .build();

            String competitions = leagueCodes == null || leagueCodes.isEmpty()
                    ? null
                    : String.join(",", leagueCodes);

            FootballDataMatchesResponse apiResponse = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/matches")
                            .queryParam("dateFrom", startDate.toString())
                            .queryParam("dateTo", endDate.toString())
                            .queryParamIfPresent("competitions", Optional.ofNullable(competitions))
                            .build())
                    .header("X-Auth-Token", externalApiProperties.getFootball().getApiKey())
                    .retrieve()
                    .bodyToMono(FootballDataMatchesResponse.class)
                    .block();

            if (apiResponse == null || apiResponse.getMatches() == null) {
                return List.of();
            }

            List<ExternalFixture> mapped = mapToExternalFixtures(apiResponse, leagueCodes);
            log.info("Mapped {} football fixtures for {} to {}", mapped.size(), startDate, endDate);
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
                    if (leagueCodes == null || leagueCodes.isEmpty()) {
                        return true;
                    }
                    return m.getCompetition() != null && leagueCodes.contains(m.getCompetition().getCode());
                })
                .map(this::toFixture)
                .toList();
    }

    private ExternalFixture toFixture(FootballDataMatch match) {
        MatchStatus status = mapStatus(match.getStatus());

        return new ExternalFixture(
                match.getId() != null ? "FOOTBALL_MATCH_" + match.getId() : null,
                match.getHomeTeam() != null ? "FOOTBALL_TEAM_" + match.getHomeTeam().getId() : null,
                match.getHomeTeam() != null ? match.getHomeTeam().getName() : null,
                match.getAwayTeam() != null ? "FOOTBALL_TEAM_" + match.getAwayTeam().getId() : null,
                match.getAwayTeam() != null ? match.getAwayTeam().getName() : null,
                match.getUtcDate() != null ? ZonedDateTime.parse(match.getUtcDate()) : null,
                match.getCompetition() != null ? "FOOTBALL_LEAGUE_" + match.getCompetition().getId() : null,
                match.getCompetition() != null ? match.getCompetition().getName() : null,
                status,
                extractHomeScore(match),
                extractAwayScore(match)
        );
    }

    private Integer extractHomeScore(FootballDataMatch match) {
        if (match.getScore() == null || match.getScore().getFullTime() == null) {
            return null;
        }
        return match.getScore().getFullTime().getHome();
    }

    private Integer extractAwayScore(FootballDataMatch match) {
        if (match.getScore() == null || match.getScore().getFullTime() == null) {
            return null;
        }
        return match.getScore().getFullTime().getAway();
    }

    private MatchStatus mapStatus(String providerStatus) {
        if (providerStatus == null) {
            return MatchStatus.UPCOMING;
        }

        return switch (providerStatus) {
            case "IN_PLAY", "PAUSED", "LIVE" -> MatchStatus.LIVE;
            case "FINISHED", "AWARDED" -> MatchStatus.FINISHED;
            default -> MatchStatus.UPCOMING;
        };
    }
}

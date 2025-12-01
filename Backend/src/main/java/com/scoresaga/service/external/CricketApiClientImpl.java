package com.scoresaga.service.external;

import com.scoresaga.config.ExternalApiProperties;
import com.scoresaga.service.external.dto.ExternalFixture;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CricketApiClientImpl implements CricketApiClient {

    private final WebClient.Builder webClientBuilder;
    private final ExternalApiProperties externalApiProperties;

    @Override
    public List<ExternalFixture> getUpcomingFixtures(LocalDate date, List<String> seriesIds) {
        WebClient webClient = webClientBuilder
                .baseUrl(externalApiProperties.getCricket().getBaseUrl())
                .build();

        // TODO: Implement actual call to cricket provider and map to ExternalFixture
        // Example:
        // return webClient.get()
        //     .uri(uriBuilder -> uriBuilder
        //         .path("/matches")
        //         .queryParam("date", date.toString())
        //         .build())
        //     .header("X-API-Key", externalApiProperties.getCricket().getApiKey())
        //     .retrieve()
        //     .bodyToMono(SomeResponse.class)
        //     .map(this::mapToExternalFixtures)
        //     .blockOptional()
        //     .orElse(List.of());

        return List.of(); // placeholder
    }

    // private List<ExternalFixture> mapToExternalFixtures(SomeResponse response) { ... }
}

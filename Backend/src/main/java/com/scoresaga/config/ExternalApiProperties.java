package com.scoresaga.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Example configuration (application.yml):
 *
 * scoresaga:
 *   external:
 *     football:
 *       base-url: https://example-football-api.com
 *       api-key: ${FOOTBALL_API_KEY}
 *     cricket:
 *       base-url: https://example-cricket-api.com
 *       api-key: ${CRICKET_API_KEY}
 */
@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "scoresaga.external")
public class ExternalApiProperties {

    private FootballProperties football = new FootballProperties();
    private CricketProperties cricket = new CricketProperties();

    @Getter
    @Setter
    public static class FootballProperties {
        private String baseUrl;
        private String apiKey;
    }

    @Getter
    @Setter
    public static class CricketProperties {
        private String baseUrl;
        private String apiKey;
    }
}

package com.scoresaga.service.external;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.scoresaga.model.enums.MatchStatus;
import com.scoresaga.service.external.api.mockcricket.MockCricketCompetition;
import com.scoresaga.service.external.api.mockcricket.MockCricketMatch;
import com.scoresaga.service.external.api.mockcricket.MockCricketMatchesResponse;
import com.scoresaga.service.external.api.mockcricket.MockCricketScore;
import com.scoresaga.service.external.api.mockcricket.MockCricketScoreTime;
import com.scoresaga.service.external.api.mockcricket.MockCricketTeam;
import com.scoresaga.service.external.dto.ExternalFixture;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@Primary
@RequiredArgsConstructor
public class MockCricketApiClientImpl implements CricketApiClient {

    private static final List<String> ICC_TEAMS = List.of(
            "India",
            "Australia",
            "England",
            "Pakistan"
    );

    private static final List<String> IPL_TEAMS = List.of(
            "CSK",
            "MI",
            "RCB",
            "KKR"
    );

    private final ObjectMapper objectMapper;

    @Override
    public List<ExternalFixture> getUpcomingFixtures(LocalDate startDate, LocalDate endDate, List<String> seriesIds) {
        try {
            String rawJson = objectMapper.writeValueAsString(buildMockResponse(startDate, endDate));
            MockCricketMatchesResponse parsed = objectMapper.readValue(rawJson, MockCricketMatchesResponse.class);

            if (parsed.getMatches() == null) {
                return List.of();
            }

            return parsed.getMatches().stream()
                    .filter(Objects::nonNull)
                    .filter(match -> matchesRequestedSeries(match, seriesIds))
                    .map(this::toFixture)
                    .toList();
        } catch (JsonProcessingException ex) {
            log.warn("Failed to generate mock cricket fixtures for {} to {}: {}", startDate, endDate, ex.getMessage());
            return List.of();
        }
    }

    private MockCricketMatchesResponse buildMockResponse(LocalDate startDate, LocalDate endDate) {
        MockCricketMatchesResponse response = new MockCricketMatchesResponse();
        List<MockCricketMatch> matches = new java.util.ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            matches.add(buildMatch(date, 0, "ICC", "ICC Champions Cup", "ICC"));
            matches.add(buildMatch(date, 1, "IPL", "Indian Premier League", "IPL"));
        }
        response.setMatches(matches);
        return response;
    }

    private MockCricketMatch buildMatch(LocalDate date, int slot, String competitionId, String competitionName, String competitionCode) {
        List<String> teamPool = selectTeamPool(competitionCode, competitionName);
        int homeIndex = Math.floorMod(date.getDayOfYear() + slot, teamPool.size());
        int awayIndex = Math.floorMod(homeIndex + 1 + slot, teamPool.size());

        String homeTeamName = teamPool.get(homeIndex);
        String awayTeamName = teamPool.get(awayIndex);

        ZonedDateTime startTime = ZonedDateTime.of(date, LocalTime.of(13 + (slot * 4), 0), ZoneOffset.UTC);
        MatchStatus status = deriveStatus(startTime);

        MockCricketCompetition competition = new MockCricketCompetition();
        competition.setId("CRICKET_LEAGUE_" + competitionId);
        competition.setName(competitionName);
        competition.setCode(competitionCode);

        MockCricketTeam homeTeam = new MockCricketTeam();
        homeTeam.setId("CRICKET_TEAM_" + sanitizeId(homeTeamName));
        homeTeam.setName(homeTeamName);

        MockCricketTeam awayTeam = new MockCricketTeam();
        awayTeam.setId("CRICKET_TEAM_" + sanitizeId(awayTeamName));
        awayTeam.setName(awayTeamName);

        MockCricketScore score = new MockCricketScore();
        MockCricketScoreTime fullTime = new MockCricketScoreTime();
        if (status != MatchStatus.UPCOMING) {
            fullTime.setHome(150 + Math.floorMod(date.getDayOfYear() + slot, 40));
            fullTime.setAway(145 + Math.floorMod(date.getDayOfYear() + slot + 3, 40));
        }
        score.setFullTime(fullTime);

        MockCricketMatch match = new MockCricketMatch();
        match.setId("CRICKET_MATCH_" + date + "_" + slot);
        match.setCompetition(competition);
        match.setHomeTeam(homeTeam);
        match.setAwayTeam(awayTeam);
        match.setUtcDate(startTime.toString());
        match.setStatus(status.name());
        match.setScore(score);
        return match;
    }

    private List<String> selectTeamPool(String competitionCode, String competitionName) {
        if ("IPL".equalsIgnoreCase(competitionCode) || "Indian Premier League".equalsIgnoreCase(competitionName)) {
            return IPL_TEAMS;
        }
        if ("ICC".equalsIgnoreCase(competitionCode) || "ICC Champions Cup".equalsIgnoreCase(competitionName)) {
            return ICC_TEAMS;
        }
        return ICC_TEAMS;
    }

    private boolean matchesRequestedSeries(MockCricketMatch match, List<String> seriesIds) {
        if (seriesIds == null || seriesIds.isEmpty()) {
            return true;
        }
        return match.getCompetition() != null && seriesIds.contains(match.getCompetition().getCode());
    }

    private ExternalFixture toFixture(MockCricketMatch match) {
        MatchStatus status = parseStatus(match.getStatus());
        Integer homeScore = extractHomeScore(match);
        Integer awayScore = extractAwayScore(match);

        return new ExternalFixture(
                match.getId(),
                match.getHomeTeam() != null ? match.getHomeTeam().getId() : null,
                match.getHomeTeam() != null ? match.getHomeTeam().getName() : null,
                match.getAwayTeam() != null ? match.getAwayTeam().getId() : null,
                match.getAwayTeam() != null ? match.getAwayTeam().getName() : null,
                match.getUtcDate() != null ? ZonedDateTime.parse(match.getUtcDate()) : null,
                match.getCompetition() != null ? match.getCompetition().getId() : null,
                match.getCompetition() != null ? match.getCompetition().getName() : null,
                status,
                homeScore,
                awayScore
        );
    }

    private Integer extractHomeScore(MockCricketMatch match) {
        if (match.getScore() == null || match.getScore().getFullTime() == null) {
            return null;
        }
        return match.getScore().getFullTime().getHome();
    }

    private Integer extractAwayScore(MockCricketMatch match) {
        if (match.getScore() == null || match.getScore().getFullTime() == null) {
            return null;
        }
        return match.getScore().getFullTime().getAway();
    }

    private MatchStatus deriveStatus(ZonedDateTime startTime) {
        ZonedDateTime now = ZonedDateTime.now(ZoneOffset.UTC);
        if (startTime.isBefore(now.minusHours(4))) {
            return MatchStatus.FINISHED;
        }
        if (!startTime.isAfter(now)) {
            return MatchStatus.LIVE;
        }
        return MatchStatus.UPCOMING;
    }

    private MatchStatus parseStatus(String status) {
        if (status == null) {
            return MatchStatus.UPCOMING;
        }
        try {
            return MatchStatus.valueOf(status);
        } catch (IllegalArgumentException ex) {
            return MatchStatus.UPCOMING;
        }
    }

    private String sanitizeId(String value) {
        return value.toUpperCase().replaceAll("[^A-Z0-9]+", "_");
    }
}

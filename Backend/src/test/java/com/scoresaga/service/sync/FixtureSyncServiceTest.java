package com.scoresaga.service.sync;

import com.scoresaga.model.Match;
import com.scoresaga.model.enums.MatchStatus;
import com.scoresaga.repository.LeagueRepository;
import com.scoresaga.repository.MatchRepository;
import com.scoresaga.repository.TeamRepository;
import com.scoresaga.service.external.CricketApiClient;
import com.scoresaga.service.external.FootballApiClient;
import com.scoresaga.service.external.dto.ExternalFixture;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;

import java.time.ZonedDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;

@SpringBootTest
@ActiveProfiles("test")
class FixtureSyncServiceTest {

    @Autowired
    private FixtureSyncService fixtureSyncService;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private TeamRepository teamRepository;

    @MockBean
    private FootballApiClient footballApiClient;

    @MockBean
    private CricketApiClient cricketApiClient;

    @BeforeEach
    void setUp() {
        matchRepository.deleteAll();
        teamRepository.deleteAll();
        leagueRepository.deleteAll();
    }

    @Test
    void syncFixturesUpsertsExistingMatchesInsteadOfDuplicatingThem() {
        ExternalFixture initialFootballFixture = new ExternalFixture(
                "FOOTBALL_MATCH_1",
                "FOOTBALL_TEAM_1",
                "Arsenal",
                "FOOTBALL_TEAM_2",
                "Chelsea",
                ZonedDateTime.parse("2026-04-10T19:00:00Z"),
                "FOOTBALL_LEAGUE_PL",
                "Premier League",
                MatchStatus.UPCOMING,
                null,
                null
        );

        ExternalFixture initialCricketFixture = new ExternalFixture(
                "CRICKET_MATCH_1",
                "CRICKET_TEAM_IND",
                "India",
                "CRICKET_TEAM_AUS",
                "Australia",
                ZonedDateTime.parse("2026-04-11T13:00:00Z"),
                "CRICKET_LEAGUE_ICC",
                "ICC Champions Cup",
                MatchStatus.UPCOMING,
                null,
                null
        );

        when(footballApiClient.getUpcomingFixtures(any(), any(), anyList()))
                .thenReturn(List.of(initialFootballFixture));
        when(cricketApiClient.getUpcomingFixtures(any(), any(), anyList()))
                .thenReturn(List.of(initialCricketFixture));

        fixtureSyncService.syncFixtures();

        assertThat(matchRepository.count()).isEqualTo(2);
        assertThat(teamRepository.count()).isEqualTo(4);
        assertThat(leagueRepository.count()).isEqualTo(2);

        ExternalFixture updatedFootballFixture = new ExternalFixture(
                "FOOTBALL_MATCH_1",
                "FOOTBALL_TEAM_1",
                "Arsenal",
                "FOOTBALL_TEAM_2",
                "Chelsea",
                ZonedDateTime.parse("2026-04-10T19:00:00Z"),
                "FOOTBALL_LEAGUE_PL",
                "Premier League",
                MatchStatus.LIVE,
                2,
                1
        );

        when(footballApiClient.getUpcomingFixtures(any(), any(), anyList()))
                .thenReturn(List.of(updatedFootballFixture));
        when(cricketApiClient.getUpcomingFixtures(any(), any(), anyList()))
                .thenReturn(List.of(initialCricketFixture));

        fixtureSyncService.syncFixtures();

        assertThat(matchRepository.count()).isEqualTo(2);
        assertThat(teamRepository.count()).isEqualTo(4);
        assertThat(leagueRepository.count()).isEqualTo(2);

        Match footballMatch = matchRepository.findByExternalId("FOOTBALL_MATCH_1").orElseThrow();
        assertThat(footballMatch.getStatus()).isEqualTo(MatchStatus.LIVE);
        assertThat(footballMatch.getHomeScore()).isEqualTo(2);
        assertThat(footballMatch.getAwayScore()).isEqualTo(1);
        assertThat(footballMatch.getLeague()).isNotNull();
        assertThat(footballMatch.getLeague().getName()).isEqualTo("Premier League");
    }
}

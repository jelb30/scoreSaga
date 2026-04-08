package com.scoresaga.service.sync;

import com.scoresaga.model.League;
import com.scoresaga.model.Match;
import com.scoresaga.model.Team;
import com.scoresaga.model.enums.LeagueType;
import com.scoresaga.model.enums.Sport;
import com.scoresaga.model.enums.TeamType;
import com.scoresaga.repository.LeagueRepository;
import com.scoresaga.repository.MatchRepository;
import com.scoresaga.repository.TeamRepository;
import com.scoresaga.service.external.CricketApiClient;
import com.scoresaga.service.external.FootballApiClient;
import com.scoresaga.service.external.dto.ExternalFixture;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FixtureSyncService {

    private static final List<String> EUROPEAN_FOOTBALL_COMPETITIONS = List.of(
            "PL",
            "CL",
            "PD",
            "SA",
            "BL1",
            "FL1"
    );

    private final FootballApiClient footballApiClient;
    private final CricketApiClient cricketApiClient;
    private final LeagueRepository leagueRepository;
    private final TeamRepository teamRepository;
    private final MatchRepository matchRepository;

    @Value("${scoresaga.sync.run-on-startup:true}")
    private boolean runSyncOnStartup;

    @EventListener(ApplicationReadyEvent.class)
    public void syncFixturesOnStartup() {
        if (!runSyncOnStartup) {
            log.info("Skipping startup fixture sync because scoresaga.sync.run-on-startup is disabled");
            return;
        }
        syncFixtures();
    }

    @Scheduled(cron = "0 0 */12 * * *", zone = "UTC")
    @Transactional
    public void syncFixtures() {
        LocalDate startDate = LocalDate.now(ZoneOffset.UTC).minusDays(1);
        LocalDate endDate = LocalDate.now(ZoneOffset.UTC).plusDays(7);

        int footballCount = syncSportRange(Sport.FOOTBALL, startDate, endDate);
        int cricketCount = syncSportRange(Sport.CRICKET, startDate, endDate);

        log.info("Fixture sync complete. Football upserts: {}, Cricket upserts: {}", footballCount, cricketCount);
    }

    private int syncSportRange(Sport sport, LocalDate startDate, LocalDate endDate) {
        int upserted = 0;

        List<ExternalFixture> fixtures = fetchFixturesForDateRange(sport, startDate, endDate);
        for (ExternalFixture fixture : fixtures) {
            upsertFixture(sport, fixture);
            upserted++;
        }

        return upserted;
    }

    private List<ExternalFixture> fetchFixturesForDateRange(Sport sport, LocalDate startDate, LocalDate endDate) {
        return switch (sport) {
            case FOOTBALL -> footballApiClient.getUpcomingFixtures(startDate, endDate, EUROPEAN_FOOTBALL_COMPETITIONS);
            case CRICKET -> cricketApiClient.getUpcomingFixtures(startDate, endDate, List.of());
        };
    }

    private void upsertFixture(Sport sport, ExternalFixture fixture) {
        if (fixture.externalMatchId() == null || fixture.homeTeamName() == null || fixture.awayTeamName() == null) {
            log.debug("Skipping malformed {} fixture payload: {}", sport, fixture);
            return;
        }

        League league = upsertLeague(sport, fixture);
        upsertTeam(sport, league, fixture.homeTeamId(), fixture.homeTeamName());
        upsertTeam(sport, league, fixture.awayTeamId(), fixture.awayTeamName());

        Match match = matchRepository.findByExternalId(fixture.externalMatchId())
                .orElseGet(Match::new);

        match.setExternalId(fixture.externalMatchId());
        match.setSport(sport);
        match.setLeague(league);
        match.setHomeTeam(fixture.homeTeamName());
        match.setAwayTeam(fixture.awayTeamName());
        match.setStartTime(toLocalDateTime(fixture));
        match.setStatus(fixture.status());
        match.setHomeScore(fixture.homeScore());
        match.setAwayScore(fixture.awayScore());

        matchRepository.save(match);
    }

    private League upsertLeague(Sport sport, ExternalFixture fixture) {
        String externalLeagueId = fixture.leagueId() != null ? fixture.leagueId() : sport.name() + "_LEAGUE_UNKNOWN";

        League league = leagueRepository.findByExternalId(externalLeagueId)
                .orElseGet(League::new);

        league.setExternalId(externalLeagueId);
        league.setSport(sport);
        league.setType(defaultLeagueType(sport, fixture.leagueName()));
        league.setName(fixture.leagueName() != null ? fixture.leagueName() : sport.name() + " League");
        league.setCode(buildLeagueCode(fixture));
        league.setSeason(String.valueOf(LocalDate.now(ZoneOffset.UTC).getYear()));

        return leagueRepository.save(league);
    }

    private Team upsertTeam(Sport sport, League league, String externalTeamId, String teamName) {
        String resolvedExternalId = externalTeamId != null
                ? externalTeamId
                : sport.name() + "_TEAM_" + teamName.toUpperCase().replaceAll("[^A-Z0-9]+", "_");

        Team team = teamRepository.findByExternalId(resolvedExternalId)
                .orElseGet(Team::new);

        team.setExternalId(resolvedExternalId);
        team.setLeague(league);
        team.setSport(sport);
        team.setType(defaultTeamType(sport, teamName));
        team.setName(teamName);
        team.setShortName(shortNameFor(teamName));

        return teamRepository.save(team);
    }

    private LocalDateTime toLocalDateTime(ExternalFixture fixture) {
        if (fixture.startTime() == null) {
            return null;
        }
        return fixture.startTime().withZoneSameInstant(ZoneOffset.UTC).toLocalDateTime();
    }

    private LeagueType defaultLeagueType(Sport sport, String leagueName) {
        if (sport == Sport.CRICKET && leagueName != null && leagueName.toUpperCase().contains("IPL")) {
            return LeagueType.LEAGUE;
        }
        if (sport == Sport.CRICKET) {
            return LeagueType.INTERNATIONAL_TOURNAMENT;
        }
        return LeagueType.LEAGUE;
    }

    private TeamType defaultTeamType(Sport sport, String teamName) {
        if (sport == Sport.FOOTBALL) {
            return TeamType.CLUB;
        }

        String normalized = teamName.toUpperCase();
        if (normalized.length() <= 4) {
            return TeamType.FRANCHISE;
        }
        return TeamType.NATIONAL;
    }

    private String shortNameFor(String teamName) {
        String compact = teamName.replaceAll("[^A-Za-z0-9 ]", "").trim();
        if (compact.isEmpty()) {
            return teamName;
        }

        String[] parts = compact.split("\\s+");
        if (parts.length == 1) {
            return parts[0].length() <= 4 ? parts[0].toUpperCase() : parts[0].substring(0, 3).toUpperCase();
        }

        StringBuilder shortName = new StringBuilder();
        for (String part : parts) {
            shortName.append(Character.toUpperCase(part.charAt(0)));
        }
        return shortName.toString();
    }

    private String buildLeagueCode(ExternalFixture fixture) {
        if (fixture.leagueId() == null) {
            return null;
        }
        return fixture.leagueId().replaceAll("^.*_", "");
    }
}

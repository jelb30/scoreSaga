package com.scoresaga.config;

import com.scoresaga.model.Match;
import com.scoresaga.model.enums.MatchStatus;
import com.scoresaga.model.enums.Sport;
import com.scoresaga.repository.MatchRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DummyDataConfig {

    @Bean
    CommandLineRunner seedMatches(MatchRepository matchRepository) {
        return args -> {
            if (matchRepository.count() > 0) {
                return;
            }

            List<Match> matches = List.of(
                    buildMatch(Sport.CRICKET, "India", "Australia", LocalDateTime.now().plusHours(3)),
                    buildMatch(Sport.CRICKET, "England", "Pakistan", LocalDateTime.now().plusHours(6)),
                    buildMatch(Sport.CRICKET, "CSK", "MI", LocalDateTime.now().plusDays(1)),
                    buildMatch(Sport.FOOTBALL, "Barcelona", "Real Madrid", LocalDateTime.now().plusHours(2)),
                    buildMatch(Sport.FOOTBALL, "Arsenal", "Liverpool", LocalDateTime.now().plusHours(5)),
                    buildMatch(Sport.FOOTBALL, "Man City", "Chelsea", LocalDateTime.now().plusDays(1))
            );

            matchRepository.saveAll(matches);
        };
    }

    private Match buildMatch(Sport sport, String home, String away, LocalDateTime startTime) {
        Match m = new Match();
        m.setSport(sport);
        m.setHomeTeam(home);
        m.setAwayTeam(away);
        m.setStartTime(startTime);
        m.setStatus(MatchStatus.UPCOMING);
        return m;
    }
}

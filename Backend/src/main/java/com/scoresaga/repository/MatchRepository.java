package com.scoresaga.repository;

import com.scoresaga.model.Match;
import com.scoresaga.model.enums.MatchStatus;
import com.scoresaga.model.enums.Sport;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {

    List<Match> findBySportAndStatusOrderByStartTimeAsc(Sport sport, MatchStatus status);
}

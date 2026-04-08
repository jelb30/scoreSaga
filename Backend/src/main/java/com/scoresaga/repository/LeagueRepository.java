package com.scoresaga.repository;

import com.scoresaga.model.League;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LeagueRepository extends JpaRepository<League, Long> {

    Optional<League> findByExternalId(String externalId);
}

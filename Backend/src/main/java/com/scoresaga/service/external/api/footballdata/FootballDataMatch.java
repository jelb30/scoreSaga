package com.scoresaga.service.external.api.footballdata;

import lombok.Data;

@Data
public class FootballDataMatch {
    private Long id;
    private FootballDataCompetition competition;
    private FootballDataTeam homeTeam;
    private FootballDataTeam awayTeam;
    private String utcDate;
    private String status;
}

package com.scoresaga.service.external.api.mockcricket;

import lombok.Data;

@Data
public class MockCricketMatch {
    private String id;
    private MockCricketCompetition competition;
    private MockCricketTeam homeTeam;
    private MockCricketTeam awayTeam;
    private String utcDate;
    private String status;
    private MockCricketScore score;
}

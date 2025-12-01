package com.scoresaga.service.external.api.football;

import lombok.Data;

@Data
public class ApiFootballFixtureItem {
    private ApiFootballFixture fixture;
    private ApiFootballLeague league;
    private ApiFootballTeams teams;
}

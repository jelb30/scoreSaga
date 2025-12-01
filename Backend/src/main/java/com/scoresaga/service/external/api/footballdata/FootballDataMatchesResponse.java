package com.scoresaga.service.external.api.footballdata;

import lombok.Data;

import java.util.List;

@Data
public class FootballDataMatchesResponse {
    private List<FootballDataMatch> matches;
}

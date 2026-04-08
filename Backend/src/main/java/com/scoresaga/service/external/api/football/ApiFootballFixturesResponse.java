package com.scoresaga.service.external.api.football;

import lombok.Data;
import java.util.List;

@Data
public class ApiFootballFixturesResponse {
    private List<ApiFootballFixtureItem> response;
}

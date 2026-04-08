package com.scoresaga.service.external.api.mockcricket;

import lombok.Data;

import java.util.List;

@Data
public class MockCricketMatchesResponse {
    private List<MockCricketMatch> matches;
}

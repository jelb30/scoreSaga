package com.scoresaga.model;

import com.scoresaga.model.enums.LeagueType;
import com.scoresaga.model.enums.Sport;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "leagues")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class League {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private Sport sport;

    @Enumerated(EnumType.STRING)
    private LeagueType type;

    private String name;
    private String code;
    private String country;
    private String season;
    private String externalId;
}

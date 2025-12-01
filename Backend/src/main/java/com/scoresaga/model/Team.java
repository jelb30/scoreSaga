package com.scoresaga.model;

import com.scoresaga.model.enums.Sport;
import com.scoresaga.model.enums.TeamType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private League league;

    @Enumerated(EnumType.STRING)
    private Sport sport;

    @Enumerated(EnumType.STRING)
    private TeamType type;

    private String name;
    private String shortName;
    private String externalId;
}

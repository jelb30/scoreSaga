package com.scoresaga.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "match_players")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MatchPlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Match match;

    @ManyToOne(optional = false)
    private Player player;

    @ManyToOne(optional = false)
    private Team team;

    private int creditValue;

    private boolean playingXi;
}

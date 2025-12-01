package com.scoresaga.model;

import com.scoresaga.model.enums.PlayerRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Team team;

    private String fullName;

    @Enumerated(EnumType.STRING)
    private PlayerRole role;

    private String externalId;
}

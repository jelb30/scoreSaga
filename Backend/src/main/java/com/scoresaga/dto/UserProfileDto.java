package com.scoresaga.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserProfileDto(
        String id,
        String email,
        String username,
        String firstName,
        String lastName,
        String phone,
        LocalDate dateOfBirth,
        String role,
        String status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}

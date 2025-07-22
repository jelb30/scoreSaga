package com.scoresaga.dto;

import lombok.*;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private LocalDate dateOfBirth;
}


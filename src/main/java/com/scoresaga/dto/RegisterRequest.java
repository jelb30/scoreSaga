package com.scoresaga.dto;

import lombok.*;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String password;
}

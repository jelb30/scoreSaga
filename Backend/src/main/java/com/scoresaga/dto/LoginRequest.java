package com.scoresaga.dto;

import lombok.*;

@Data
@Getter
public class LoginRequest {
    private String email;
    private String password;
}

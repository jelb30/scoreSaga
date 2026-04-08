package com.scoresaga.auth;

import com.scoresaga.dto.*;
import jakarta.validation.Valid;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.scoresaga.util.JwtUtil;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.registerUser(request);
        return ResponseEntity.ok("User registered successfully.");
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        AuthResponse response = authService.login(request);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildAuthCookie(response.getToken(), jwtUtil.getJwtExpirationMs() / 1000, httpRequest).toString())
                .body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest httpRequest) {
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, buildAuthCookie("", 0, httpRequest).toString())
                .body("Logged out");
    }

    private ResponseCookie buildAuthCookie(String token, long maxAgeSeconds, HttpServletRequest httpRequest) {
        return ResponseCookie.from("access_token", token)
                .httpOnly(true)
                .secure(httpRequest.isSecure())
                .path("/")
                .sameSite("Lax")
                .maxAge(maxAgeSeconds)
                .build();
    }
}

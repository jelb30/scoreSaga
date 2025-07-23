package com.scoresaga.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    @GetMapping("/profile")
    public UserProfileResponse getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        System.out.println("WE ARE HERE....!");
        return new UserProfileResponse(
                userDetails.getUsername(),  // returns email
                "USER"
        );
    }

    @GetMapping("/test")
    public String test() {
        return "🔥 Controller working!";
    }

    private record UserProfileResponse(String email, String role) {}
}

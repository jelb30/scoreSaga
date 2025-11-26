package com.scoresaga.auth;

import com.scoresaga.dto.*;
import com.scoresaga.enums.Role;
import com.scoresaga.enums.Status;
import com.scoresaga.model.User;
import com.scoresaga.repository.UserRepository;
import com.scoresaga.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.math.BigDecimal;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered.");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Username already taken.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setDateOfBirth(request.getDateOfBirth());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER.toString());
        user.setStatus(Status.ACTIVE.toString());

        userRepository.save(user);
    }


    public AuthResponse login(LoginRequest request) {
        log.info("CHECKING WHILE LOGIN!!");
        log.info("EMAIL FROM REQUEST: " + request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        log.info("FOUND USER IN DB: " + user.getEmail());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getEmail());
        log.info("TOKEN FOR: " + user.getEmail());
        return new AuthResponse(token);
    }

}

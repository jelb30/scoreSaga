package com.scoresaga.config;

import com.scoresaga.model.User;
import com.scoresaga.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@Slf4j
@Service
@Component
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Loading user by email: " + email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        log.info("User found in UserDetailsService: " + user.getEmail());
        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole()));
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities
        );
    }
}

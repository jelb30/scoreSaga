package com.scoresaga.config;

import com.scoresaga.util.JwtUtil;
import lombok.extern.slf4j.Slf4j;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.*;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String token = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }

        if (token == null) {
            Cookie[] cookies = request.getCookies();
            if (cookies != null) {
                for (Cookie cookie : cookies) {
                    if ("access_token".equals(cookie.getName())) {
                        token = cookie.getValue();
                        break;
                    }
                }
            }
        }

        if (token == null) {
            log.info("NO JWT PROVIDED: " + request.getRequestURI());
            filterChain.doFilter(request, response);
            return;
        }

        if (!jwtUtil.validateToken(token)) {
            log.info("INVALID JWT TOKEN!");
            filterChain.doFilter(request, response);
            return;
        }

        String email = jwtUtil.extractUsername(token);
        log.info("EXTRACTED EMAIL FROM THE TOKEN: " + email);

        // Ensure we don't overwrite existing context
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());

            authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authToken);

            log.info("SecurityContext SET FOR THE USER: " + email);
        }

        filterChain.doFilter(request, response);
    }
}

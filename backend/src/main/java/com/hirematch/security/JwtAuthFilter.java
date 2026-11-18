package com.hirematch.security;

import com.hirematch.entity.User;
import com.hirematch.enums.Role;
import com.hirematch.repository.UserRepository;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@Order(1)
public class JwtAuthFilter implements Filter {

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        // CORS headers
        httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
        httpResponse.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, X-Requested-With");
        httpResponse.setHeader("Access-Control-Max-Age", "3600");

        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            return;
        }

        try {
            String bearerToken = httpRequest.getHeader("Authorization");
            if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
                String token = bearerToken.substring(7);
                if (jwtTokenProvider.validateToken(token)) {
                    Long userId = jwtTokenProvider.getUserIdFromToken(token);
                    String email = jwtTokenProvider.getEmailFromToken(token);
                    Role role = jwtTokenProvider.getRoleFromToken(token);

                    Optional<User> userOpt = userRepository.findById(userId);
                    if (userOpt.isPresent() && userOpt.get().isEnabled()) {
                        User user = userOpt.get();
                        UserPrincipal principal = new UserPrincipal(
                                user.getId(),
                                user.getEmail(),
                                user.getFullName(),
                                user.getRole()
                        );
                        SecurityContext.setCurrentUser(principal);
                    }
                }
            }

            chain.doFilter(request, response);
        } finally {
            SecurityContext.clear();
        }
    }
}

package com.hirematch.service;

import com.hirematch.dto.auth.AuthResponse;
import com.hirematch.dto.auth.LoginRequest;
import com.hirematch.dto.auth.RegisterRequest;
import com.hirematch.entity.CandidateProfile;
import com.hirematch.entity.RecruiterProfile;
import com.hirematch.entity.User;
import com.hirematch.enums.Role;
import com.hirematch.exception.BadRequestException;
import com.hirematch.exception.UnauthorizedException;
import com.hirematch.repository.CandidateProfileRepository;
import com.hirematch.repository.RecruiterProfileRepository;
import com.hirematch.repository.UserRepository;
import com.hirematch.security.JwtTokenProvider;
import com.hirematch.security.PasswordUtils;
import com.hirematch.security.SecurityContext;
import com.hirematch.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (req.getFullName() == null || req.getFullName().trim().isEmpty()) {
            throw new BadRequestException("Full name is required.");
        }
        if (req.getEmail() == null || !req.getEmail().contains("@")) {
            throw new BadRequestException("Valid email address is required.");
        }
        if (req.getPassword() == null || req.getPassword().length() < 6) {
            throw new BadRequestException("Password must be at least 6 characters long.");
        }
        if (req.getConfirmPassword() != null && !req.getPassword().equals(req.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match.");
        }
        if (userRepository.existsByEmail(req.getEmail().trim().toLowerCase())) {
            throw new BadRequestException("Email is already registered.");
        }
        if (req.getRole() == Role.ADMIN) {
            throw new BadRequestException("Self-registration as ADMIN is prohibited.");
        }

        Role role = req.getRole() != null ? req.getRole() : Role.CANDIDATE;
        String hashedPassword = PasswordUtils.hashPassword(req.getPassword());

        User user = new User(req.getFullName().trim(), req.getEmail().trim().toLowerCase(), hashedPassword, role);
        user = userRepository.save(user);

        // Auto-create associated profile
        if (role == Role.CANDIDATE) {
            CandidateProfile cp = new CandidateProfile(user);
            candidateProfileRepository.save(cp);
        } else if (role == Role.RECRUITER) {
            RecruiterProfile rp = new RecruiterProfile(user, "Hire Match AI Enterprise", "Senior Talent Partner", "");
            recruiterProfileRepository.save(rp);
        }

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public AuthResponse login(LoginRequest req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            throw new BadRequestException("Email and password are required.");
        }

        User user = userRepository.findByEmail(req.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password."));

        if (!user.isEnabled()) {
            throw new UnauthorizedException("Your account has been deactivated. Please contact administrator.");
        }

        if (!PasswordUtils.verifyPassword(req.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password.");
        }

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public User getCurrentUser() {
        UserPrincipal principal = SecurityContext.getCurrentUser();
        if (principal == null) {
            throw new UnauthorizedException("Authentication required.");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new UnauthorizedException("User not found."));
    }
}

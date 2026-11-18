package com.hirematch.controller;

import com.hirematch.dto.recruiter.RecruiterDashboardResponse;
import com.hirematch.entity.RecruiterProfile;
import com.hirematch.entity.User;
import com.hirematch.enums.Role;
import com.hirematch.repository.RecruiterProfileRepository;
import com.hirematch.security.RequireRole;
import com.hirematch.service.AuthService;
import com.hirematch.service.RecruiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiters")
@RequireRole({Role.RECRUITER, Role.ADMIN})
public class RecruiterController {

    @Autowired
    private RecruiterService recruiterService;

    @Autowired
    private AuthService authService;

    @Autowired
    private RecruiterProfileRepository recruiterProfileRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<RecruiterDashboardResponse> getDashboardMetrics() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(recruiterService.getDashboardMetrics(user));
    }

    @GetMapping("/profile")
    public ResponseEntity<RecruiterProfile> getProfile() {
        User user = authService.getCurrentUser();
        RecruiterProfile profile = recruiterProfileRepository.findByUser(user)
                .orElseGet(() -> recruiterProfileRepository.save(new RecruiterProfile(user, "Hire Match AI Corp", "Lead Talent Recruiter", "")));
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<RecruiterProfile> updateProfile(@RequestBody RecruiterProfile updated) {
        User user = authService.getCurrentUser();
        RecruiterProfile profile = recruiterProfileRepository.findByUser(user)
                .orElseGet(() -> new RecruiterProfile(user, "", "", ""));

        profile.setCompanyName(updated.getCompanyName());
        profile.setDesignation(updated.getDesignation());
        profile.setContactNumber(updated.getContactNumber());
        return ResponseEntity.ok(recruiterProfileRepository.save(profile));
    }
}

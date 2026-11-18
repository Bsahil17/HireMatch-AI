package com.hirematch.controller;

import com.hirematch.dto.application.ApplicationResponse;
import com.hirematch.entity.User;
import com.hirematch.enums.ApplicationStatus;
import com.hirematch.enums.Role;
import com.hirematch.security.RequireRole;
import com.hirematch.service.ApplicationService;
import com.hirematch.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @RequireRole({Role.CANDIDATE, Role.ADMIN})
    public ResponseEntity<ApplicationResponse> apply(@RequestBody Map<String, Object> body) {
        User user = authService.getCurrentUser();
        Long jobId = Long.valueOf(body.get("jobId").toString());
        Long resumeId = body.containsKey("resumeId") && body.get("resumeId") != null
                ? Long.valueOf(body.get("resumeId").toString())
                : null;

        return ResponseEntity.ok(applicationService.applyForJob(jobId, resumeId, user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getById(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(applicationService.getApplicationById(id, user));
    }

    @PatchMapping("/{id}/status")
    @RequireRole({Role.RECRUITER, Role.ADMIN})
    public ResponseEntity<ApplicationResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusBody
    ) {
        User user = authService.getCurrentUser();
        ApplicationStatus status = ApplicationStatus.valueOf(statusBody.get("status").toUpperCase());
        return ResponseEntity.ok(applicationService.updateStatus(id, status, user));
    }

    @GetMapping("/job/{jobId}")
    @RequireRole({Role.RECRUITER, Role.ADMIN})
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByJob(@PathVariable Long jobId) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, user));
    }
}

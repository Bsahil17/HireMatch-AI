package com.hirematch.controller;

import com.hirematch.dto.job.JobCreateRequest;
import com.hirematch.dto.job.JobResponse;
import com.hirematch.entity.User;
import com.hirematch.enums.EmploymentType;
import com.hirematch.enums.JobStatus;
import com.hirematch.enums.Role;
import com.hirematch.security.RequireRole;
import com.hirematch.service.AuthService;
import com.hirematch.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private AuthService authService;

    @PostMapping
    @RequireRole({Role.RECRUITER, Role.ADMIN})
    public ResponseEntity<JobResponse> createJob(@RequestBody JobCreateRequest request) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(jobService.createJob(request, user));
    }

    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllPublishedJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) EmploymentType employmentType
    ) {
        return ResponseEntity.ok(jobService.getPublishedJobs(keyword, location, employmentType));
    }

    @GetMapping("/recruiter")
    @RequireRole({Role.RECRUITER, Role.ADMIN})
    public ResponseEntity<List<JobResponse>> getRecruiterJobs() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(jobService.getJobsForRecruiter(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobResponseById(id));
    }

    @PutMapping("/{id}")
    @RequireRole({Role.RECRUITER, Role.ADMIN})
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @RequestBody JobCreateRequest request
    ) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(jobService.updateJob(id, request, user));
    }

    @PatchMapping("/{id}/status")
    @RequireRole({Role.RECRUITER, Role.ADMIN})
    public ResponseEntity<JobResponse> updateJobStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusBody
    ) {
        User user = authService.getCurrentUser();
        JobStatus status = JobStatus.valueOf(statusBody.get("status").toUpperCase());
        return ResponseEntity.ok(jobService.updateJobStatus(id, status, user));
    }

    @DeleteMapping("/{id}")
    @RequireRole({Role.RECRUITER, Role.ADMIN})
    public ResponseEntity<Map<String, String>> deleteJob(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        jobService.deleteJob(id, user);
        return ResponseEntity.ok(Map.of("message", "Job opening successfully removed."));
    }
}

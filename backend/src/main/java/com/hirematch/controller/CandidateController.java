package com.hirematch.controller;

import com.hirematch.dto.application.ApplicationResponse;
import com.hirematch.dto.candidate.CandidateProfileResponse;
import com.hirematch.dto.candidate.CandidateProfileUpdateRequest;
import com.hirematch.entity.Resume;
import com.hirematch.entity.User;
import com.hirematch.enums.Role;
import com.hirematch.security.RequireRole;
import com.hirematch.service.ApplicationService;
import com.hirematch.service.AuthService;
import com.hirematch.service.CandidateService;
import com.hirematch.service.ResumeStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    @Autowired
    private CandidateService candidateService;

    @Autowired
    private AuthService authService;

    @Autowired
    private ResumeStorageService resumeStorageService;

    @Autowired
    private ApplicationService applicationService;

    @GetMapping("/profile")
    public ResponseEntity<CandidateProfileResponse> getMyProfile() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(candidateService.getProfile(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<CandidateProfileResponse> updateMyProfile(
            @RequestBody CandidateProfileUpdateRequest request
    ) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(candidateService.updateProfile(user, request));
    }

    @PostMapping(value = "/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @RequireRole({Role.CANDIDATE, Role.ADMIN})
    public ResponseEntity<Map<String, Object>> uploadResume(@RequestParam("file") MultipartFile file) {
        User user = authService.getCurrentUser();
        Resume resume = resumeStorageService.uploadResume(file, user);
        return ResponseEntity.ok(Map.of(
                "message", "Resume uploaded and analyzed successfully.",
                "resumeId", resume.getId(),
                "fileName", resume.getOriginalFileName(),
                "fileType", resume.getFileType()
        ));
    }

    @GetMapping("/resume/{id}/download")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id) {
        Resource resource = resumeStorageService.getResumeFileAsResource(id);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/applications")
    @RequireRole({Role.CANDIDATE, Role.ADMIN})
    public ResponseEntity<List<ApplicationResponse>> getMyApplications() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(applicationService.getApplicationsForCandidate(user));
    }

    @GetMapping("/{id}")
    @RequireRole({Role.RECRUITER, Role.ADMIN})
    public ResponseEntity<CandidateProfileResponse> getCandidateById(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getProfileByCandidateId(id));
    }
}

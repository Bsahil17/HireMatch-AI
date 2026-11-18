package com.hirematch.controller;

import com.hirematch.dto.application.ApplicationResponse;
import com.hirematch.entity.Application;
import com.hirematch.enums.Role;
import com.hirematch.exception.ResourceNotFoundException;
import com.hirematch.repository.ApplicationRepository;
import com.hirematch.security.RequireRole;
import com.hirematch.service.AiIntegrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequireRole({Role.RECRUITER, Role.ADMIN})
public class AiController {

    @Autowired
    private AiIntegrationService aiIntegrationService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @PostMapping("/analyze/{applicationId}")
    public ResponseEntity<ApplicationResponse> analyzeSingleApplication(@PathVariable Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
        aiIntegrationService.analyzeApplication(app);
        return ResponseEntity.ok(aiIntegrationService.getAnalysisByApplicationId(applicationId));
    }

    @PostMapping("/analyze/job/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> analyzeAllJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(aiIntegrationService.triggerBatchAnalysisForJob(jobId));
    }

    @GetMapping("/analysis/{applicationId}")
    public ResponseEntity<ApplicationResponse> getAnalysisByApplicationId(@PathVariable Long applicationId) {
        return ResponseEntity.ok(aiIntegrationService.getAnalysisByApplicationId(applicationId));
    }

    @GetMapping("/job/{jobId}/rankings")
    public ResponseEntity<List<ApplicationResponse>> getJobRankings(@PathVariable Long jobId) {
        return ResponseEntity.ok(aiIntegrationService.getJobRankings(jobId));
    }

    @GetMapping("/job/{jobId}/analysis-status")
    public ResponseEntity<Map<String, Object>> getJobAnalysisStatus(@PathVariable Long jobId) {
        List<ApplicationResponse> rankings = aiIntegrationService.getJobRankings(jobId);
        long completed = rankings.stream().filter(r -> r.getOverallMatchScore() > 0).count();
        return ResponseEntity.ok(Map.of(
                "jobId", jobId,
                "totalCandidates", rankings.size(),
                "completedCount", completed,
                "percentComplete", rankings.isEmpty() ? 100 : (int) ((completed * 100.0) / rankings.size())
        ));
    }
}

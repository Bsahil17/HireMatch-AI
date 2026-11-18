package com.hirematch.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hirematch.client.PythonAiClient;
import com.hirematch.dto.application.ApplicationResponse;
import com.hirematch.entity.Application;
import com.hirematch.entity.Job;
import com.hirematch.entity.Resume;
import com.hirematch.entity.ResumeAnalysis;
import com.hirematch.enums.AnalysisStatus;
import com.hirematch.exception.ResourceNotFoundException;
import com.hirematch.repository.ApplicationRepository;
import com.hirematch.repository.ResumeAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiIntegrationService {

    @Autowired
    private PythonAiClient pythonAiClient;

    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public ResumeAnalysis analyzeApplication(Application application) {
        Job job = application.getJob();
        Resume resume = application.getResume();

        ResumeAnalysis analysis = resumeAnalysisRepository.findByApplication(application)
                .orElseGet(() -> new ResumeAnalysis(application));

        analysis.setAnalysisStatus(AnalysisStatus.PROCESSING);
        analysis = resumeAnalysisRepository.save(analysis);

        List<String> requiredList = parseCommaList(job.getRequiredSkills());
        List<String> preferredList = parseCommaList(job.getPreferredSkills());

        String resumeText = (resume != null && resume.getExtractedText() != null)
                ? resume.getExtractedText()
                : "Candidate " + application.getCandidate().getFullName() + " applying for " + job.getTitle();

        Map<String, Object> aiResult = pythonAiClient.matchResume(
                application.getId(),
                application.getCandidate().getFullName(),
                resumeText,
                job.getId(),
                job.getTitle(),
                job.getDepartment(),
                requiredList,
                preferredList,
                job.getMinExperience(),
                job.getMaxExperience(),
                job.getEducation(),
                job.getDescription()
        );

        if (aiResult != null && aiResult.containsKey("overall_match_score")) {
            analysis.setOverallMatchScore(((Number) aiResult.get("overall_match_score")).intValue());
            analysis.setRecommendation((String) aiResult.get("recommendation"));
            analysis.setMatchedSkills(toJsonOrComma(aiResult.get("matched_skills")));
            analysis.setMissingSkills(toJsonOrComma(aiResult.get("missing_skills")));
            analysis.setPreferredSkills(toJsonOrComma(aiResult.get("preferred_skills_matched")));

            if (aiResult.containsKey("required_skills_score")) {
                analysis.setRequiredSkillsScore(((Number) aiResult.get("required_skills_score")).doubleValue());
            }
            if (aiResult.containsKey("experience_score")) {
                analysis.setExperienceScore(((Number) aiResult.get("experience_score")).doubleValue());
            }
            if (aiResult.containsKey("experience_match")) {
                analysis.setExperienceMatch((Boolean) aiResult.get("experience_match"));
            }
            if (aiResult.containsKey("candidate_experience_years")) {
                analysis.setCandidateExperienceYears(((Number) aiResult.get("candidate_experience_years")).doubleValue());
            }
            if (aiResult.containsKey("candidate_strengths")) {
                analysis.setCandidateStrengths(toJsonOrComma(aiResult.get("candidate_strengths")));
            }
            if (aiResult.containsKey("explanation")) {
                analysis.setExplanation((String) aiResult.get("explanation"));
            }
            if (aiResult.containsKey("semantic_summary")) {
                analysis.setSemanticSummary((String) aiResult.get("semantic_summary"));
            }

            analysis.setAnalysisStatus(AnalysisStatus.COMPLETED);
        } else {
            analysis.setAnalysisStatus(AnalysisStatus.FAILED);
        }

        return resumeAnalysisRepository.save(analysis);
    }

    @Transactional
    public List<ApplicationResponse> triggerBatchAnalysisForJob(Long jobId) {
        List<Application> apps = applicationRepository.findByJobId(jobId);
        List<ApplicationResponse> responses = new ArrayList<>();
        for (Application app : apps) {
            ResumeAnalysis analysis = analyzeApplication(app);
            responses.add(ApplicationResponse.fromEntity(app, analysis));
        }
        responses.sort((a, b) -> Integer.compare(b.getOverallMatchScore(), a.getOverallMatchScore()));
        return responses;
    }

    public List<ApplicationResponse> getJobRankings(Long jobId) {
        List<ResumeAnalysis> ranked = resumeAnalysisRepository.findRankedAnalysesByJobId(jobId);
        return ranked.stream()
                .map(ra -> ApplicationResponse.fromEntity(ra.getApplication(), ra))
                .collect(Collectors.toList());
    }

    public ApplicationResponse getAnalysisByApplicationId(Long applicationId) {
        ResumeAnalysis analysis = resumeAnalysisRepository.findByApplicationId(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("No AI analysis found for application #" + applicationId));
        return ApplicationResponse.fromEntity(analysis.getApplication(), analysis);
    }

    private List<String> parseCommaList(String str) {
        if (str == null || str.trim().isEmpty()) return Collections.emptyList();
        return Arrays.stream(str.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private String toJsonOrComma(Object obj) {
        if (obj == null) return "";
        if (obj instanceof List) {
            return String.join(", ", ((List<?>) obj).stream().map(Object::toString).collect(Collectors.toList()));
        }
        return obj.toString();
    }
}

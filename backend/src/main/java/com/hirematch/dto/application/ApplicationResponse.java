package com.hirematch.dto.application;

import com.hirematch.entity.Application;
import com.hirematch.entity.ResumeAnalysis;
import com.hirematch.enums.AnalysisStatus;
import com.hirematch.enums.ApplicationStatus;
import java.time.LocalDateTime;

public class ApplicationResponse {
    private Long id;
    private Long candidateId;
    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;
    private Double candidateExperienceYears;
    private String candidateSkills;

    private Long jobId;
    private String jobTitle;
    private String companyName;
    private String department;
    private String requiredSkills;

    private Long resumeId;
    private String resumeFileName;

    private ApplicationStatus status;
    private Integer overallMatchScore;
    private String recommendation;
    private AnalysisStatus analysisStatus;
    private String matchedSkills;
    private String missingSkills;
    private String preferredSkills;
    private Double requiredSkillsScore;
    private Double experienceScore;
    private String candidateStrengths;
    private String explanation;
    private String semanticSummary;

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

    public ApplicationResponse() {}

    public static ApplicationResponse fromEntity(Application app, ResumeAnalysis analysis) {
        ApplicationResponse resp = new ApplicationResponse();
        resp.setId(app.getId());
        resp.setCandidateId(app.getCandidate().getId());
        resp.setCandidateName(app.getCandidate().getFullName());
        resp.setCandidateEmail(app.getCandidate().getEmail());
        resp.setJobId(app.getJob().getId());
        resp.setJobTitle(app.getJob().getTitle());
        resp.setCompanyName(app.getJob().getCompanyName());
        resp.setDepartment(app.getJob().getDepartment());
        resp.setRequiredSkills(app.getJob().getRequiredSkills());

        if (app.getResume() != null) {
            resp.setResumeId(app.getResume().getId());
            resp.setResumeFileName(app.getResume().getOriginalFileName());
        }

        resp.setStatus(app.getStatus());
        resp.setAppliedAt(app.getAppliedAt());
        resp.setUpdatedAt(app.getUpdatedAt());

        if (analysis != null) {
            resp.setOverallMatchScore(analysis.getOverallMatchScore());
            resp.setRecommendation(analysis.getRecommendation());
            resp.setAnalysisStatus(analysis.getAnalysisStatus());
            resp.setMatchedSkills(analysis.getMatchedSkills());
            resp.setMissingSkills(analysis.getMissingSkills());
            resp.setPreferredSkills(analysis.getPreferredSkills());
            resp.setRequiredSkillsScore(analysis.getRequiredSkillsScore());
            resp.setExperienceScore(analysis.getExperienceScore());
            resp.setCandidateExperienceYears(analysis.getCandidateExperienceYears());
            resp.setCandidateStrengths(analysis.getCandidateStrengths());
            resp.setExplanation(analysis.getExplanation());
            resp.setSemanticSummary(analysis.getSemanticSummary());
        } else {
            resp.setOverallMatchScore(0);
            resp.setAnalysisStatus(AnalysisStatus.PENDING);
        }

        return resp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCandidateId() { return candidateId; }
    public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }

    public String getCandidateName() { return candidateName; }
    public void setCandidateName(String candidateName) { this.candidateName = candidateName; }

    public String getCandidateEmail() { return candidateEmail; }
    public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }

    public String getCandidatePhone() { return candidatePhone; }
    public void setCandidatePhone(String candidatePhone) { this.candidatePhone = candidatePhone; }

    public Double getCandidateExperienceYears() { return candidateExperienceYears; }
    public void setCandidateExperienceYears(Double candidateExperienceYears) { this.candidateExperienceYears = candidateExperienceYears; }

    public String getCandidateSkills() { return candidateSkills; }
    public void setCandidateSkills(String candidateSkills) { this.candidateSkills = candidateSkills; }

    public Long getJobId() { return jobId; }
    public void setJobId(Long jobId) { this.jobId = jobId; }

    public String getJobTitle() { return jobTitle; }
    public void setJobTitle(String jobTitle) { this.jobTitle = jobTitle; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }

    public String getResumeFileName() { return resumeFileName; }
    public void setResumeFileName(String resumeFileName) { this.resumeFileName = resumeFileName; }

    public ApplicationStatus getStatus() { return status; }
    public void setStatus(ApplicationStatus status) { this.status = status; }

    public Integer getOverallMatchScore() { return overallMatchScore; }
    public void setOverallMatchScore(Integer overallMatchScore) { this.overallMatchScore = overallMatchScore; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public AnalysisStatus getAnalysisStatus() { return analysisStatus; }
    public void setAnalysisStatus(AnalysisStatus analysisStatus) { this.analysisStatus = analysisStatus; }

    public String getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(String matchedSkills) { this.matchedSkills = matchedSkills; }

    public String getMissingSkills() { return missingSkills; }
    public void setMissingSkills(String missingSkills) { this.missingSkills = missingSkills; }

    public String getPreferredSkills() { return preferredSkills; }
    public void setPreferredSkills(String preferredSkills) { this.preferredSkills = preferredSkills; }

    public Double getRequiredSkillsScore() { return requiredSkillsScore; }
    public void setRequiredSkillsScore(Double requiredSkillsScore) { this.requiredSkillsScore = requiredSkillsScore; }

    public Double getExperienceScore() { return experienceScore; }
    public void setExperienceScore(Double experienceScore) { this.experienceScore = experienceScore; }

    public String getCandidateStrengths() { return candidateStrengths; }
    public void setCandidateStrengths(String candidateStrengths) { this.candidateStrengths = candidateStrengths; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getSemanticSummary() { return semanticSummary; }
    public void setSemanticSummary(String semanticSummary) { this.semanticSummary = semanticSummary; }

    public LocalDateTime getAppliedAt() { return appliedAt; }
    public void setAppliedAt(LocalDateTime appliedAt) { this.appliedAt = appliedAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

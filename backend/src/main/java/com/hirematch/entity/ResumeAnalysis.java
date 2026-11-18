package com.hirematch.entity;

import com.hirematch.enums.AnalysisStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analyses")
public class ResumeAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false, unique = true)
    private Application application;

    @Column(nullable = false)
    private Integer overallMatchScore = 0;

    private String recommendation; // Strong Match, Good Match, Moderate Match, Low Match

    @Column(columnDefinition = "TEXT")
    private String matchedSkills; // JSON / Comma-separated

    @Column(columnDefinition = "TEXT")
    private String missingSkills;

    @Column(columnDefinition = "TEXT")
    private String preferredSkills;

    private Double requiredSkillsScore = 0.0;
    private Double preferredSkillsScore = 0.0;
    private Double experienceScore = 0.0;
    private Double educationScore = 0.0;
    private Double projectScore = 0.0;

    private Boolean experienceMatch = false;
    private Boolean educationMatch = false;
    private Double candidateExperienceYears = 0.0;

    @Column(columnDefinition = "TEXT")
    private String candidateStrengths;

    @Column(columnDefinition = "TEXT")
    private String candidateGaps;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(columnDefinition = "TEXT")
    private String semanticSummary;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AnalysisStatus analysisStatus = AnalysisStatus.PENDING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public ResumeAnalysis() {}

    public ResumeAnalysis(Application application) {
        this.application = application;
        this.analysisStatus = AnalysisStatus.PENDING;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Application getApplication() { return application; }
    public void setApplication(Application application) { this.application = application; }

    public Integer getOverallMatchScore() { return overallMatchScore; }
    public void setOverallMatchScore(Integer overallMatchScore) { this.overallMatchScore = overallMatchScore; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    public String getMatchedSkills() { return matchedSkills; }
    public void setMatchedSkills(String matchedSkills) { this.matchedSkills = matchedSkills; }

    public String getMissingSkills() { return missingSkills; }
    public void setMissingSkills(String missingSkills) { this.missingSkills = missingSkills; }

    public String getPreferredSkills() { return preferredSkills; }
    public void setPreferredSkills(String preferredSkills) { this.preferredSkills = preferredSkills; }

    public Double getRequiredSkillsScore() { return requiredSkillsScore; }
    public void setRequiredSkillsScore(Double requiredSkillsScore) { this.requiredSkillsScore = requiredSkillsScore; }

    public Double getPreferredSkillsScore() { return preferredSkillsScore; }
    public void setPreferredSkillsScore(Double preferredSkillsScore) { this.preferredSkillsScore = preferredSkillsScore; }

    public Double getExperienceScore() { return experienceScore; }
    public void setExperienceScore(Double experienceScore) { this.experienceScore = experienceScore; }

    public Double getEducationScore() { return educationScore; }
    public void setEducationScore(Double educationScore) { this.educationScore = educationScore; }

    public Double getProjectScore() { return projectScore; }
    public void setProjectScore(Double projectScore) { this.projectScore = projectScore; }

    public Boolean getExperienceMatch() { return experienceMatch; }
    public void setExperienceMatch(Boolean experienceMatch) { this.experienceMatch = experienceMatch; }

    public Boolean getEducationMatch() { return educationMatch; }
    public void setEducationMatch(Boolean educationMatch) { this.educationMatch = educationMatch; }

    public Double getCandidateExperienceYears() { return candidateExperienceYears; }
    public void setCandidateExperienceYears(Double candidateExperienceYears) { this.candidateExperienceYears = candidateExperienceYears; }

    public String getCandidateStrengths() { return candidateStrengths; }
    public void setCandidateStrengths(String candidateStrengths) { this.candidateStrengths = candidateStrengths; }

    public String getCandidateGaps() { return candidateGaps; }
    public void setCandidateGaps(String candidateGaps) { this.candidateGaps = candidateGaps; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getSemanticSummary() { return semanticSummary; }
    public void setSemanticSummary(String semanticSummary) { this.semanticSummary = semanticSummary; }

    public AnalysisStatus getAnalysisStatus() { return analysisStatus; }
    public void setAnalysisStatus(AnalysisStatus analysisStatus) { this.analysisStatus = analysisStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

package com.hirematch.dto.candidate;

import com.hirematch.entity.CandidateProfile;

public class CandidateProfileResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String location;
    private String education;
    private String college;
    private String degree;
    private Integer graduationYear;
    private Double experienceYears;
    private String skills;
    private String linkedinUrl;
    private String githubUrl;
    private Long resumeId;
    private String resumeFileName;
    private int profileCompletionPercentage;

    public CandidateProfileResponse() {}

    public static CandidateProfileResponse fromEntity(CandidateProfile profile, Long resumeId, String resumeFileName) {
        CandidateProfileResponse resp = new CandidateProfileResponse();
        resp.setId(profile.getId());
        resp.setUserId(profile.getUser().getId());
        resp.setFullName(profile.getUser().getFullName());
        resp.setEmail(profile.getUser().getEmail());
        resp.setPhone(profile.getPhone());
        resp.setLocation(profile.getLocation());
        resp.setEducation(profile.getEducation());
        resp.setCollege(profile.getCollege());
        resp.setDegree(profile.getDegree());
        resp.setGraduationYear(profile.getGraduationYear());
        resp.setExperienceYears(profile.getExperienceYears());
        resp.setSkills(profile.getSkills());
        resp.setLinkedinUrl(profile.getLinkedinUrl());
        resp.setGithubUrl(profile.getGithubUrl());
        resp.setResumeId(resumeId);
        resp.setResumeFileName(resumeFileName);

        int filled = 2; // name & email
        if (profile.getPhone() != null && !profile.getPhone().isEmpty()) filled++;
        if (profile.getLocation() != null && !profile.getLocation().isEmpty()) filled++;
        if (profile.getDegree() != null && !profile.getDegree().isEmpty()) filled++;
        if (profile.getSkills() != null && !profile.getSkills().isEmpty()) filled++;
        if (resumeId != null) filled += 2;
        resp.setProfileCompletionPercentage(Math.min(100, (int) Math.round((filled / 8.0) * 100)));

        return resp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getDegree() { return degree; }
    public void setDegree(String degree) { this.degree = degree; }

    public Integer getGraduationYear() { return graduationYear; }
    public void setGraduationYear(Integer graduationYear) { this.graduationYear = graduationYear; }

    public Double getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Double experienceYears) { this.experienceYears = experienceYears; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }

    public String getGithubUrl() { return githubUrl; }
    public void setGithubUrl(String githubUrl) { this.githubUrl = githubUrl; }

    public Long getResumeId() { return resumeId; }
    public void setResumeId(Long resumeId) { this.resumeId = resumeId; }

    public String getResumeFileName() { return resumeFileName; }
    public void setResumeFileName(String resumeFileName) { this.resumeFileName = resumeFileName; }

    public int getProfileCompletionPercentage() { return profileCompletionPercentage; }
    public void setProfileCompletionPercentage(int profileCompletionPercentage) { this.profileCompletionPercentage = profileCompletionPercentage; }
}

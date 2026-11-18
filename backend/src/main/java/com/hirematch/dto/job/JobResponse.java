package com.hirematch.dto.job;

import com.hirematch.entity.Job;
import com.hirematch.enums.EmploymentType;
import com.hirematch.enums.JobStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class JobResponse {
    private Long id;
    private Long recruiterId;
    private String recruiterName;
    private String title;
    private String companyName;
    private String department;
    private String description;
    private String requiredSkills;
    private String preferredSkills;
    private Double minExperience;
    private Double maxExperience;
    private String education;
    private String location;
    private EmploymentType employmentType;
    private String salaryRange;
    private Integer openings;
    private LocalDate deadline;
    private JobStatus status;
    private long applicationCount;
    private LocalDateTime createdAt;

    public JobResponse() {}

    public static JobResponse fromEntity(Job job, long applicationCount) {
        JobResponse resp = new JobResponse();
        resp.setId(job.getId());
        resp.setRecruiterId(job.getRecruiter().getId());
        resp.setRecruiterName(job.getRecruiter().getFullName());
        resp.setTitle(job.getTitle());
        resp.setCompanyName(job.getCompanyName());
        resp.setDepartment(job.getDepartment());
        resp.setDescription(job.getDescription());
        resp.setRequiredSkills(job.getRequiredSkills());
        resp.setPreferredSkills(job.getPreferredSkills());
        resp.setMinExperience(job.getMinExperience());
        resp.setMaxExperience(job.getMaxExperience());
        resp.setEducation(job.getEducation());
        resp.setLocation(job.getLocation());
        resp.setEmploymentType(job.getEmploymentType());
        resp.setSalaryRange(job.getSalaryRange());
        resp.setOpenings(job.getOpenings());
        resp.setDeadline(job.getDeadline());
        resp.setStatus(job.getStatus());
        resp.setApplicationCount(applicationCount);
        resp.setCreatedAt(job.getCreatedAt());
        return resp;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getRecruiterId() { return recruiterId; }
    public void setRecruiterId(Long recruiterId) { this.recruiterId = recruiterId; }

    public String getRecruiterName() { return recruiterName; }
    public void setRecruiterName(String recruiterName) { this.recruiterName = recruiterName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(String requiredSkills) { this.requiredSkills = requiredSkills; }

    public String getPreferredSkills() { return preferredSkills; }
    public void setPreferredSkills(String preferredSkills) { this.preferredSkills = preferredSkills; }

    public Double getMinExperience() { return minExperience; }
    public void setMinExperience(Double minExperience) { this.minExperience = minExperience; }

    public Double getMaxExperience() { return maxExperience; }
    public void setMaxExperience(Double maxExperience) { this.maxExperience = maxExperience; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public EmploymentType getEmploymentType() { return employmentType; }
    public void setEmploymentType(EmploymentType employmentType) { this.employmentType = employmentType; }

    public String getSalaryRange() { return salaryRange; }
    public void setSalaryRange(String salaryRange) { this.salaryRange = salaryRange; }

    public Integer getOpenings() { return openings; }
    public void setOpenings(Integer openings) { this.openings = openings; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public JobStatus getStatus() { return status; }
    public void setStatus(JobStatus status) { this.status = status; }

    public long getApplicationCount() { return applicationCount; }
    public void setApplicationCount(long applicationCount) { this.applicationCount = applicationCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

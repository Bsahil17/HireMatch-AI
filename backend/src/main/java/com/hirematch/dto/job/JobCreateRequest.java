package com.hirematch.dto.job;

import com.hirematch.enums.EmploymentType;
import com.hirematch.enums.JobStatus;
import java.time.LocalDate;

public class JobCreateRequest {
    private String title;
    private String companyName;
    private String department;
    private String description;
    private String requiredSkills;
    private String preferredSkills;
    private Double minExperience = 0.0;
    private Double maxExperience;
    private String education;
    private String location;
    private EmploymentType employmentType = EmploymentType.FULL_TIME;
    private String salaryRange;
    private Integer openings = 1;
    private LocalDate deadline;
    private JobStatus status = JobStatus.OPEN;

    public JobCreateRequest() {}

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
}

package com.hirematch.service;

import com.hirematch.dto.job.JobCreateRequest;
import com.hirematch.dto.job.JobResponse;
import com.hirematch.entity.Job;
import com.hirematch.entity.User;
import com.hirematch.enums.EmploymentType;
import com.hirematch.enums.JobStatus;
import com.hirematch.enums.Role;
import com.hirematch.exception.BadRequestException;
import com.hirematch.exception.ResourceNotFoundException;
import com.hirematch.exception.UnauthorizedException;
import com.hirematch.repository.ApplicationRepository;
import com.hirematch.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Transactional
    public JobResponse createJob(JobCreateRequest req, User recruiter) {
        if (recruiter.getRole() != Role.RECRUITER && recruiter.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only recruiters can post job openings.");
        }
        if (req.getTitle() == null || req.getTitle().trim().isEmpty()) {
            throw new BadRequestException("Job title is required.");
        }
        if (req.getRequiredSkills() == null || req.getRequiredSkills().trim().isEmpty()) {
            throw new BadRequestException("At least one required skill must be defined.");
        }

        Job job = new Job();
        job.setRecruiter(recruiter);
        job.setTitle(req.getTitle().trim());
        job.setCompanyName(req.getCompanyName() != null ? req.getCompanyName().trim() : "TechCorp");
        job.setDepartment(req.getDepartment());
        job.setDescription(req.getDescription() != null ? req.getDescription().trim() : req.getTitle());
        job.setRequiredSkills(req.getRequiredSkills().trim());
        job.setPreferredSkills(req.getPreferredSkills());
        job.setMinExperience(req.getMinExperience() != null ? req.getMinExperience() : 0.0);
        job.setMaxExperience(req.getMaxExperience());
        job.setEducation(req.getEducation());
        job.setLocation(req.getLocation() != null ? req.getLocation() : "Remote / Hybrid");
        job.setEmploymentType(req.getEmploymentType() != null ? req.getEmploymentType() : EmploymentType.FULL_TIME);
        job.setSalaryRange(req.getSalaryRange());
        job.setOpenings(req.getOpenings() != null ? req.getOpenings() : 1);
        job.setDeadline(req.getDeadline());
        job.setStatus(req.getStatus() != null ? req.getStatus() : JobStatus.OPEN);

        job = jobRepository.save(job);
        return JobResponse.fromEntity(job, 0);
    }

    public JobResponse getJobResponseById(Long jobId) {
        Job job = getJobEntity(jobId);
        long count = applicationRepository.countByJobId(jobId);
        return JobResponse.fromEntity(job, count);
    }

    public Job getJobEntity(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job opening not found with id: " + jobId));
    }

    public List<JobResponse> getPublishedJobs(String keyword, String location, EmploymentType type) {
        List<Job> jobs;
        if (keyword != null && !keyword.trim().isEmpty()) {
            jobs = jobRepository.searchJobs(keyword.trim(), JobStatus.OPEN);
        } else {
            jobs = jobRepository.findByStatus(JobStatus.OPEN);
        }

        return jobs.stream()
                .filter(j -> location == null || location.trim().isEmpty() ||
                        j.getLocation().toLowerCase().contains(location.trim().toLowerCase()))
                .filter(j -> type == null || j.getEmploymentType() == type)
                .map(j -> JobResponse.fromEntity(j, applicationRepository.countByJobId(j.getId())))
                .collect(Collectors.toList());
    }

    public List<JobResponse> getJobsForRecruiter(User recruiter) {
        List<Job> jobs;
        if (recruiter.getRole() == Role.ADMIN) {
            jobs = jobRepository.findAll();
        } else {
            jobs = jobRepository.findByRecruiter(recruiter);
        }
        return jobs.stream()
                .map(j -> JobResponse.fromEntity(j, applicationRepository.countByJobId(j.getId())))
                .collect(Collectors.toList());
    }

    @Transactional
    public JobResponse updateJob(Long jobId, JobCreateRequest req, User recruiter) {
        Job job = getJobEntity(jobId);
        validateOwnership(job, recruiter);

        job.setTitle(req.getTitle().trim());
        job.setCompanyName(req.getCompanyName());
        job.setDepartment(req.getDepartment());
        job.setDescription(req.getDescription());
        job.setRequiredSkills(req.getRequiredSkills());
        job.setPreferredSkills(req.getPreferredSkills());
        job.setMinExperience(req.getMinExperience());
        job.setMaxExperience(req.getMaxExperience());
        job.setEducation(req.getEducation());
        job.setLocation(req.getLocation());
        job.setEmploymentType(req.getEmploymentType());
        job.setSalaryRange(req.getSalaryRange());
        job.setOpenings(req.getOpenings());
        job.setDeadline(req.getDeadline());
        if (req.getStatus() != null) {
            job.setStatus(req.getStatus());
        }

        job = jobRepository.save(job);
        long count = applicationRepository.countByJobId(jobId);
        return JobResponse.fromEntity(job, count);
    }

    @Transactional
    public JobResponse updateJobStatus(Long jobId, JobStatus status, User recruiter) {
        Job job = getJobEntity(jobId);
        validateOwnership(job, recruiter);
        job.setStatus(status);
        job = jobRepository.save(job);
        return JobResponse.fromEntity(job, applicationRepository.countByJobId(jobId));
    }

    @Transactional
    public void deleteJob(Long jobId, User recruiter) {
        Job job = getJobEntity(jobId);
        validateOwnership(job, recruiter);
        jobRepository.delete(job);
    }

    private void validateOwnership(Job job, User user) {
        if (user.getRole() != Role.ADMIN && !job.getRecruiter().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to modify this job posting.");
        }
    }
}

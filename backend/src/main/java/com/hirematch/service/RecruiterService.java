package com.hirematch.service;

import com.hirematch.dto.application.ApplicationResponse;
import com.hirematch.dto.recruiter.RecruiterDashboardResponse;
import com.hirematch.entity.Application;
import com.hirematch.entity.Job;
import com.hirematch.entity.ResumeAnalysis;
import com.hirematch.entity.User;
import com.hirematch.enums.ApplicationStatus;
import com.hirematch.enums.Role;
import com.hirematch.repository.ApplicationRepository;
import com.hirematch.repository.JobRepository;
import com.hirematch.repository.ResumeAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecruiterService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;

    public RecruiterDashboardResponse getDashboardMetrics(User user) {
        Long recruiterId = user.getId();
        boolean isAdmin = user.getRole() == Role.ADMIN;

        long totalJobs = isAdmin ? jobRepository.count() : jobRepository.countByRecruiterId(recruiterId);
        long totalApps = isAdmin ? applicationRepository.count() : applicationRepository.countByJobRecruiterId(recruiterId);
        long underReview = isAdmin ? applicationRepository.countByStatus(ApplicationStatus.UNDER_REVIEW)
                : applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.UNDER_REVIEW);
        long shortlisted = isAdmin ? applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED)
                : applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.SHORTLISTED);
        long interviewed = isAdmin ? applicationRepository.countByStatus(ApplicationStatus.INTERVIEW_SCHEDULED)
                : applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.INTERVIEW_SCHEDULED);
        long rejected = isAdmin ? applicationRepository.countByStatus(ApplicationStatus.REJECTED)
                : applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.REJECTED);

        Double avgScore = resumeAnalysisRepository.getAverageScoreForRecruiter(recruiterId);
        if (avgScore == null) avgScore = 78.4;

        List<Application> recentApps = applicationRepository.findRecentApplicationsForRecruiter(recruiterId);
        List<ApplicationResponse> recentResponses = recentApps.stream().limit(6).map(app -> {
            ResumeAnalysis analysis = resumeAnalysisRepository.findByApplication(app).orElse(null);
            return ApplicationResponse.fromEntity(app, analysis);
        }).collect(Collectors.toList());

        List<ResumeAnalysis> topAnalyses = resumeAnalysisRepository.findTopCandidatesForRecruiter(recruiterId);
        List<ApplicationResponse> topResponses = topAnalyses.stream().limit(5).map(ra ->
                ApplicationResponse.fromEntity(ra.getApplication(), ra)
        ).collect(Collectors.toList());

        Map<String, Long> statusDist = new LinkedHashMap<>();
        statusDist.put("Applied", applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.APPLIED));
        statusDist.put("Under Review", underReview);
        statusDist.put("Shortlisted", shortlisted);
        statusDist.put("Interview", interviewed);
        statusDist.put("Selected", applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.SELECTED));
        statusDist.put("Rejected", rejected);

        Map<String, Long> appsPerJob = new LinkedHashMap<>();
        List<Job> jobs = jobRepository.findByRecruiterId(recruiterId);
        for (Job j : jobs) {
            appsPerJob.put(j.getTitle(), applicationRepository.countByJobId(j.getId()));
        }

        RecruiterDashboardResponse resp = new RecruiterDashboardResponse();
        resp.setTotalJobOpenings(totalJobs);
        resp.setTotalApplications(totalApps);
        resp.setApplicationsUnderReview(underReview);
        resp.setShortlistedCandidates(shortlisted);
        resp.setInterviewedCandidates(interviewed);
        resp.setRejectedApplications(rejected);
        resp.setAverageMatchScore(Math.round(avgScore * 10.0) / 10.0);
        resp.setRecentApplications(recentResponses);
        resp.setTopCandidates(topResponses);
        resp.setStatusDistribution(statusDist);
        resp.setApplicationsPerJob(appsPerJob);

        return resp;
    }
}

package com.hirematch.dto.recruiter;

import com.hirematch.dto.application.ApplicationResponse;
import java.util.List;
import java.util.Map;

public class RecruiterDashboardResponse {
    private long totalJobOpenings;
    private long totalApplications;
    private long applicationsUnderReview;
    private long shortlistedCandidates;
    private long interviewedCandidates;
    private long rejectedApplications;
    private double averageMatchScore;

    private List<ApplicationResponse> recentApplications;
    private List<ApplicationResponse> topCandidates;
    private Map<String, Long> statusDistribution;
    private Map<String, Long> applicationsPerJob;

    public RecruiterDashboardResponse() {}

    public long getTotalJobOpenings() { return totalJobOpenings; }
    public void setTotalJobOpenings(long totalJobOpenings) { this.totalJobOpenings = totalJobOpenings; }

    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }

    public long getApplicationsUnderReview() { return applicationsUnderReview; }
    public void setApplicationsUnderReview(long applicationsUnderReview) { this.applicationsUnderReview = applicationsUnderReview; }

    public long getShortlistedCandidates() { return shortlistedCandidates; }
    public void setShortlistedCandidates(long shortlistedCandidates) { this.shortlistedCandidates = shortlistedCandidates; }

    public long getInterviewedCandidates() { return interviewedCandidates; }
    public void setInterviewedCandidates(long interviewedCandidates) { this.interviewedCandidates = interviewedCandidates; }

    public long getRejectedApplications() { return rejectedApplications; }
    public void setRejectedApplications(long rejectedApplications) { this.rejectedApplications = rejectedApplications; }

    public double getAverageMatchScore() { return averageMatchScore; }
    public void setAverageMatchScore(double averageMatchScore) { this.averageMatchScore = averageMatchScore; }

    public List<ApplicationResponse> getRecentApplications() { return recentApplications; }
    public void setRecentApplications(List<ApplicationResponse> recentApplications) { this.recentApplications = recentApplications; }

    public List<ApplicationResponse> getTopCandidates() { return topCandidates; }
    public void setTopCandidates(List<ApplicationResponse> topCandidates) { this.topCandidates = topCandidates; }

    public Map<String, Long> getStatusDistribution() { return statusDistribution; }
    public void setStatusDistribution(Map<String, Long> statusDistribution) { this.statusDistribution = statusDistribution; }

    public Map<String, Long> getApplicationsPerJob() { return applicationsPerJob; }
    public void setApplicationsPerJob(Map<String, Long> applicationsPerJob) { this.applicationsPerJob = applicationsPerJob; }
}

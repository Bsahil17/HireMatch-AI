package com.hirematch.service;

import com.hirematch.entity.Job;
import com.hirematch.entity.ResumeAnalysis;
import com.hirematch.entity.User;
import com.hirematch.enums.ApplicationStatus;
import com.hirematch.repository.ApplicationRepository;
import com.hirematch.repository.JobRepository;
import com.hirematch.repository.ResumeAnalysisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;

    public Map<String, Object> getRecruitmentAnalytics(User recruiter) {
        Long recruiterId = recruiter.getId();
        Map<String, Object> data = new HashMap<>();

        // 1. Funnel Stats
        Map<String, Long> funnel = new LinkedHashMap<>();
        funnel.put("Applied", applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.APPLIED));
        funnel.put("Under Review", applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.UNDER_REVIEW));
        funnel.put("Shortlisted", applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.SHORTLISTED));
        funnel.put("Interview", applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.INTERVIEW_SCHEDULED));
        funnel.put("Selected", applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.SELECTED));
        funnel.put("Rejected", applicationRepository.countByJobRecruiterIdAndStatus(recruiterId, ApplicationStatus.REJECTED));
        data.put("funnel", funnel);

        // 2. Score Distribution
        List<ResumeAnalysis> all = resumeAnalysisRepository.findAll();
        int strong = 0, good = 0, moderate = 0, low = 0;
        for (ResumeAnalysis ra : all) {
            int score = ra.getOverallMatchScore();
            if (score >= 85) strong++;
            else if (score >= 70) good++;
            else if (score >= 50) moderate++;
            else low++;
        }
        Map<String, Integer> scoreDist = new LinkedHashMap<>();
        scoreDist.put("Strong Match (85-100%)", strong);
        scoreDist.put("Good Match (70-84%)", good);
        scoreDist.put("Moderate Match (50-69%)", moderate);
        scoreDist.put("Low Match (<50%)", low);
        data.put("scoreDistribution", scoreDist);

        // 3. Applications Per Job Chart
        List<Map<String, Object>> jobStats = new ArrayList<>();
        List<Job> jobs = jobRepository.findByRecruiterId(recruiterId);
        for (Job j : jobs) {
            Map<String, Object> map = new HashMap<>();
            map.put("jobTitle", j.getTitle());
            map.put("applications", applicationRepository.countByJobId(j.getId()));
            jobStats.add(map);
        }
        data.put("applicationsPerJob", jobStats);

        // 4. Monthly Trend Data
        List<Map<String, Object>> monthly = new ArrayList<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov"};
        int[] counts = {12, 19, 28, 35, 42, 58, 64, 78, 92, 110, 134};
        for (int i = 0; i < months.length; i++) {
            Map<String, Object> m = new HashMap<>();
            m.put("month", months[i]);
            m.put("applications", counts[i]);
            monthly.add(m);
        }
        data.put("monthlyTrend", monthly);

        return data;
    }
}

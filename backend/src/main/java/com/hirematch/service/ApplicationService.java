package com.hirematch.service;

import com.hirematch.dto.application.ApplicationResponse;
import com.hirematch.entity.*;
import com.hirematch.enums.AnalysisStatus;
import com.hirematch.enums.ApplicationStatus;
import com.hirematch.enums.JobStatus;
import com.hirematch.enums.Role;
import com.hirematch.exception.BadRequestException;
import com.hirematch.exception.ResourceNotFoundException;
import com.hirematch.exception.UnauthorizedException;
import com.hirematch.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private ResumeAnalysisRepository resumeAnalysisRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private AiIntegrationService aiIntegrationService;

    @Transactional
    public ApplicationResponse applyForJob(Long jobId, Long resumeId, User candidate) {
        if (candidate.getRole() != Role.CANDIDATE && candidate.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only candidates can apply for jobs.");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job opening not found."));

        if (job.getStatus() != JobStatus.OPEN) {
            throw new BadRequestException("This job opening is currently closed to new applications.");
        }

        if (applicationRepository.existsByCandidateIdAndJobId(candidate.getId(), jobId)) {
            throw new BadRequestException("You have already submitted an application for this position.");
        }

        Resume resume;
        if (resumeId != null) {
            resume = resumeRepository.findById(resumeId)
                    .orElseThrow(() -> new ResourceNotFoundException("Selected resume was not found."));
        } else {
            resume = resumeRepository.findFirstByCandidateIdOrderByUploadDateDesc(candidate.getId())
                    .orElseThrow(() -> new BadRequestException("Please upload your resume before submitting an application."));
        }

        Application application = new Application(candidate, job, resume);
        application = applicationRepository.save(application);

        // Create initial ResumeAnalysis placeholder
        ResumeAnalysis analysis = new ResumeAnalysis(application);
        analysis = resumeAnalysisRepository.save(analysis);

        // Trigger AI Resume Screening
        try {
            analysis = aiIntegrationService.analyzeApplication(application);
        } catch (Exception e) {
            // Keep analysis status as PENDING if AI service is offline
        }

        // Notify Recruiter
        Notification recruiterNote = new Notification(
                job.getRecruiter(),
                "New Application Received",
                candidate.getFullName() + " applied for " + job.getTitle() + " (Match Score: " + analysis.getOverallMatchScore() + "%)"
        );
        notificationRepository.save(recruiterNote);

        // Notify Candidate
        Notification candNote = new Notification(
                candidate,
                "Application Submitted",
                "Your application for " + job.getTitle() + " at " + job.getCompanyName() + " was successfully received."
        );
        notificationRepository.save(candNote);

        // Log Activity
        activityLogRepository.save(new ActivityLog(
                candidate,
                "APPLY_JOB",
                "Applied for position: " + job.getTitle() + " (" + job.getCompanyName() + ")"
        ));

        return ApplicationResponse.fromEntity(application, analysis);
    }

    @Transactional
    public ApplicationResponse updateStatus(Long applicationId, ApplicationStatus newStatus, User user) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found."));

        Job job = application.getJob();
        if (user.getRole() != Role.ADMIN && !job.getRecruiter().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to update applications for this job.");
        }

        application.setStatus(newStatus);
        application = applicationRepository.save(application);

        // Send Notification to candidate on status change
        String statusMessage = getStatusNotificationMessage(job.getTitle(), job.getCompanyName(), newStatus);
        Notification note = new Notification(application.getCandidate(), "Application Status Updated", statusMessage);
        notificationRepository.save(note);

        // Activity log
        activityLogRepository.save(new ActivityLog(
                user,
                "UPDATE_APPLICATION_STATUS",
                "Updated application #" + applicationId + " (" + application.getCandidate().getFullName() + ") to " + newStatus
        ));

        ResumeAnalysis analysis = resumeAnalysisRepository.findByApplication(application).orElse(null);
        return ApplicationResponse.fromEntity(application, analysis);
    }

    public List<ApplicationResponse> getApplicationsForJob(Long jobId, User user) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job opening not found."));

        if (user.getRole() != Role.ADMIN && !job.getRecruiter().getId().equals(user.getId())) {
            throw new UnauthorizedException("Unauthorized to view applications for this job.");
        }

        List<Application> apps = applicationRepository.findByJobId(jobId);
        return apps.stream().map(app -> {
            ResumeAnalysis analysis = resumeAnalysisRepository.findByApplication(app).orElse(null);
            return ApplicationResponse.fromEntity(app, analysis);
        }).collect(Collectors.toList());
    }

    public List<ApplicationResponse> getApplicationsForCandidate(User candidate) {
        List<Application> apps = applicationRepository.findByCandidateId(candidate.getId());
        return apps.stream().map(app -> {
            ResumeAnalysis analysis = resumeAnalysisRepository.findByApplication(app).orElse(null);
            return ApplicationResponse.fromEntity(app, analysis);
        }).collect(Collectors.toList());
    }

    public ApplicationResponse getApplicationById(Long applicationId, User user) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found."));

        // Candidate or owning recruiter or Admin
        boolean isOwnerRecruiter = app.getJob().getRecruiter().getId().equals(user.getId());
        boolean isCandidate = app.getCandidate().getId().equals(user.getId());
        if (!isOwnerRecruiter && !isCandidate && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Not authorized to view this application.");
        }

        ResumeAnalysis analysis = resumeAnalysisRepository.findByApplication(app).orElse(null);
        return ApplicationResponse.fromEntity(app, analysis);
    }

    private String getStatusNotificationMessage(String jobTitle, String company, ApplicationStatus status) {
        switch (status) {
            case SHORTLISTED:
                return "Congratulations! You have been shortlisted for " + jobTitle + " at " + company + ".";
            case INTERVIEW_SCHEDULED:
                return "An interview has been scheduled for your application for " + jobTitle + ". Please check your interview details.";
            case UNDER_REVIEW:
                return "Your application for " + jobTitle + " is currently under active recruiter review.";
            case SELECTED:
                return "Exciting news! You have been selected for the position of " + jobTitle + " at " + company + "!";
            case REJECTED:
                return "Thank you for taking the time to apply for " + jobTitle + ". After careful review, the team has decided to proceed with other candidates.";
            default:
                return "Your application for " + jobTitle + " has been updated to: " + status;
        }
    }
}

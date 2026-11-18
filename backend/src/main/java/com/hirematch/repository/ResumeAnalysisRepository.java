package com.hirematch.repository;

import com.hirematch.entity.Application;
import com.hirematch.entity.ResumeAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeAnalysisRepository extends JpaRepository<ResumeAnalysis, Long> {
    Optional<ResumeAnalysis> findByApplication(Application application);
    Optional<ResumeAnalysis> findByApplicationId(Long applicationId);

    @Query("SELECT ra FROM ResumeAnalysis ra WHERE ra.application.job.id = :jobId ORDER BY ra.overallMatchScore DESC")
    List<ResumeAnalysis> findRankedAnalysesByJobId(@Param("jobId") Long jobId);

    @Query("SELECT ra FROM ResumeAnalysis ra WHERE ra.application.job.recruiter.id = :recruiterId AND ra.overallMatchScore >= 80 ORDER BY ra.overallMatchScore DESC")
    List<ResumeAnalysis> findTopCandidatesForRecruiter(@Param("recruiterId") Long recruiterId);

    @Query("SELECT AVG(ra.overallMatchScore) FROM ResumeAnalysis ra WHERE ra.application.job.recruiter.id = :recruiterId")
    Double getAverageScoreForRecruiter(@Param("recruiterId") Long recruiterId);
}

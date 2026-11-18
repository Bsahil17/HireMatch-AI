package com.hirematch.repository;

import com.hirematch.entity.Application;
import com.hirematch.entity.Job;
import com.hirematch.entity.User;
import com.hirematch.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidate(User candidate);
    List<Application> findByCandidateId(Long candidateId);
    List<Application> findByJob(Job job);
    List<Application> findByJobId(Long jobId);
    
    Optional<Application> findByCandidateIdAndJobId(Long candidateId, Long jobId);
    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);

    long countByJobId(Long jobId);
    long countByStatus(ApplicationStatus status);
    long countByJobRecruiterId(Long recruiterId);
    long countByJobRecruiterIdAndStatus(Long recruiterId, ApplicationStatus status);

    @Query("SELECT a FROM Application a WHERE a.job.recruiter.id = :recruiterId ORDER BY a.appliedAt DESC")
    List<Application> findRecentApplicationsForRecruiter(@Param("recruiterId") Long recruiterId);
}

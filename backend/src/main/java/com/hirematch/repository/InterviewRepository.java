package com.hirematch.repository;

import com.hirematch.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByApplicationId(Long applicationId);

    @Query("SELECT i FROM Interview i WHERE i.application.job.recruiter.id = :recruiterId ORDER BY i.scheduledDate ASC")
    List<Interview> findUpcomingForRecruiter(@Param("recruiterId") Long recruiterId);

    @Query("SELECT i FROM Interview i WHERE i.application.candidate.id = :candidateId ORDER BY i.scheduledDate ASC")
    List<Interview> findUpcomingForCandidate(@Param("candidateId") Long candidateId);
}

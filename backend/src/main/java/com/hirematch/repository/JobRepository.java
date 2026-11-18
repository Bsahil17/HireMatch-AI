package com.hirematch.repository;

import com.hirematch.entity.Job;
import com.hirematch.entity.User;
import com.hirematch.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiter(User recruiter);
    List<Job> findByRecruiterId(Long recruiterId);
    List<Job> findByStatus(JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = :status AND (" +
           "LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.companyName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Job> searchJobs(@Param("keyword") String keyword, @Param("status") JobStatus status);

    long countByRecruiterId(Long recruiterId);
}

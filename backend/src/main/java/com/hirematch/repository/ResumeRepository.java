package com.hirematch.repository;

import com.hirematch.entity.Resume;
import com.hirematch.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    List<Resume> findByCandidate(User candidate);
    List<Resume> findByCandidateIdOrderByUploadDateDesc(Long candidateId);
    Optional<Resume> findFirstByCandidateIdOrderByUploadDateDesc(Long candidateId);
}

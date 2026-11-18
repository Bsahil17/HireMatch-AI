package com.hirematch.service;

import com.hirematch.dto.candidate.CandidateProfileResponse;
import com.hirematch.dto.candidate.CandidateProfileUpdateRequest;
import com.hirematch.entity.CandidateProfile;
import com.hirematch.entity.Resume;
import com.hirematch.entity.User;
import com.hirematch.exception.ResourceNotFoundException;
import com.hirematch.repository.CandidateProfileRepository;
import com.hirematch.repository.ResumeRepository;
import com.hirematch.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CandidateService {

    @Autowired
    private CandidateProfileRepository candidateProfileRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private UserRepository userRepository;

    public CandidateProfileResponse getProfile(User user) {
        CandidateProfile profile = candidateProfileRepository.findByUser(user)
                .orElseGet(() -> candidateProfileRepository.save(new CandidateProfile(user)));

        Optional<Resume> latestResume = resumeRepository.findFirstByCandidateIdOrderByUploadDateDesc(user.getId());
        Long resumeId = latestResume.map(Resume::getId).orElse(null);
        String resumeName = latestResume.map(Resume::getOriginalFileName).orElse(null);

        return CandidateProfileResponse.fromEntity(profile, resumeId, resumeName);
    }

    public CandidateProfileResponse getProfileByCandidateId(Long candidateId) {
        CandidateProfile profile = candidateProfileRepository.findByUserId(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate profile not found."));

        Optional<Resume> latestResume = resumeRepository.findFirstByCandidateIdOrderByUploadDateDesc(candidateId);
        Long resumeId = latestResume.map(Resume::getId).orElse(null);
        String resumeName = latestResume.map(Resume::getOriginalFileName).orElse(null);

        return CandidateProfileResponse.fromEntity(profile, resumeId, resumeName);
    }

    @Transactional
    public CandidateProfileResponse updateProfile(User user, CandidateProfileUpdateRequest req) {
        CandidateProfile profile = candidateProfileRepository.findByUser(user)
                .orElseGet(() -> new CandidateProfile(user));

        if (req.getFullName() != null && !req.getFullName().trim().isEmpty()) {
            user.setFullName(req.getFullName().trim());
            userRepository.save(user);
        }

        profile.setPhone(req.getPhone());
        profile.setLocation(req.getLocation());
        profile.setEducation(req.getEducation());
        profile.setCollege(req.getCollege());
        profile.setDegree(req.getDegree());
        profile.setGraduationYear(req.getGraduationYear());
        profile.setExperienceYears(req.getExperienceYears());
        profile.setSkills(req.getSkills());
        profile.setLinkedinUrl(req.getLinkedinUrl());
        profile.setGithubUrl(req.getGithubUrl());

        profile = candidateProfileRepository.save(profile);

        Optional<Resume> latestResume = resumeRepository.findFirstByCandidateIdOrderByUploadDateDesc(user.getId());
        Long resumeId = latestResume.map(Resume::getId).orElse(null);
        String resumeName = latestResume.map(Resume::getOriginalFileName).orElse(null);

        return CandidateProfileResponse.fromEntity(profile, resumeId, resumeName);
    }
}

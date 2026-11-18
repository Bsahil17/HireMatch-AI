package com.hirematch.service;

import com.hirematch.entity.User;
import com.hirematch.enums.Role;
import com.hirematch.exception.ResourceNotFoundException;
import com.hirematch.repository.ApplicationRepository;
import com.hirematch.repository.JobRepository;
import com.hirematch.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    public Map<String, Object> getAdminOverview() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalRecruiters", userRepository.countByRole(Role.RECRUITER));
        stats.put("totalCandidates", userRepository.countByRole(Role.CANDIDATE));
        stats.put("totalJobs", jobRepository.count());
        stats.put("totalApplications", applicationRepository.count());
        return stats;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setEnabled(!user.isEnabled());
        return userRepository.save(user);
    }
}

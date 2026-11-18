package com.hirematch;

import com.hirematch.dto.auth.AuthResponse;
import com.hirematch.dto.auth.LoginRequest;
import com.hirematch.dto.auth.RegisterRequest;
import com.hirematch.dto.job.JobCreateRequest;
import com.hirematch.dto.job.JobResponse;
import com.hirematch.entity.User;
import com.hirematch.enums.Role;
import com.hirematch.service.AuthService;
import com.hirematch.service.JobService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("h2")
public class HireMatchApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private JobService jobService;

    @Test
    void testContextLoads() {
        assertNotNull(authService);
        assertNotNull(jobService);
    }

    @Test
    void testUserRegistrationAndLogin() {
        String testEmail = "testuser." + System.currentTimeMillis() + "@hirematch.ai";
        RegisterRequest reg = new RegisterRequest();
        reg.setFullName("Test User");
        reg.setEmail(testEmail);
        reg.setPassword("Password@123");
        reg.setConfirmPassword("Password@123");
        reg.setRole(Role.CANDIDATE);

        AuthResponse regResp = authService.register(reg);
        assertNotNull(regResp);
        assertNotNull(regResp.getToken());
        assertEquals("Test User", regResp.getFullName());

        LoginRequest login = new LoginRequest(testEmail, "Password@123");
        AuthResponse loginResp = authService.login(login);
        assertNotNull(loginResp);
        assertNotNull(loginResp.getToken());
    }

    @Test
    void testRecruiterJobCreation() {
        String recruiterEmail = "recruiter." + System.currentTimeMillis() + "@hirematch.ai";
        RegisterRequest reg = new RegisterRequest();
        reg.setFullName("Recruiter Jane");
        reg.setEmail(recruiterEmail);
        reg.setPassword("Password@123");
        reg.setRole(Role.RECRUITER);
        authService.register(reg);

        User recruiter = authService.login(new LoginRequest(recruiterEmail, "Password@123")) != null
                ? authService.getCurrentUser() : null;

        // If security context is not populated via HTTP, test via direct entity
        User testRecruiter = new User("Jane", recruiterEmail, "hash", Role.RECRUITER);
        testRecruiter.setId(100L);

        JobCreateRequest jReq = new JobCreateRequest();
        jReq.setTitle("Senior Cloud Engineer");
        jReq.setCompanyName("Tech Innovators");
        jReq.setRequiredSkills("AWS, Kubernetes, Terraform");
        jReq.setMinExperience(4.0);
        jReq.setLocation("Remote");

        assertDoesNotThrow(() -> {
            JobResponse jResp = jobService.createJob(jReq, testRecruiter);
            assertNotNull(jResp);
            assertEquals("Senior Cloud Engineer", jResp.getTitle());
        });
    }
}

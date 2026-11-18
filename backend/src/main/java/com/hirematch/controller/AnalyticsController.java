package com.hirematch.controller;

import com.hirematch.entity.User;
import com.hirematch.enums.Role;
import com.hirematch.security.RequireRole;
import com.hirematch.service.AnalyticsService;
import com.hirematch.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequireRole({Role.RECRUITER, Role.ADMIN})
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private AuthService authService;

    @GetMapping("/overview")
    public ResponseEntity<Map<String, Object>> getOverview() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(analyticsService.getRecruitmentAnalytics(user));
    }
}

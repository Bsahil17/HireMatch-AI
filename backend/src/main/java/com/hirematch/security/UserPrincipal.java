package com.hirematch.security;

import com.hirematch.enums.Role;

public class UserPrincipal {
    private final Long id;
    private final String email;
    private final String fullName;
    private final Role role;

    public UserPrincipal(Long id, String email, String fullName, Role role) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }

    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getFullName() { return fullName; }
    public Role getRole() { return role; }

    public boolean isAdmin() { return role == Role.ADMIN; }
    public boolean isRecruiter() { return role == Role.RECRUITER; }
    public boolean isCandidate() { return role == Role.CANDIDATE; }
}

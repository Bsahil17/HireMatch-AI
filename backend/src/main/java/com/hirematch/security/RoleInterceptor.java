package com.hirematch.security;

import com.hirematch.enums.Role;
import com.hirematch.exception.UnauthorizedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Arrays;

@Component
public class RoleInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        RequireRole requireRole = handlerMethod.getMethodAnnotation(RequireRole.class);
        if (requireRole == null) {
            requireRole = handlerMethod.getBeanType().getAnnotation(RequireRole.class);
        }

        if (requireRole == null) {
            return true; // No role annotation required
        }

        UserPrincipal currentUser = SecurityContext.getCurrentUser();
        if (currentUser == null) {
            throw new UnauthorizedException("Authentication token is required to access this resource.");
        }

        Role[] allowedRoles = requireRole.value();
        if (allowedRoles.length > 0) {
            boolean hasPermission = Arrays.asList(allowedRoles).contains(currentUser.getRole())
                    || currentUser.getRole() == Role.ADMIN; // ADMIN has super-access

            if (!hasPermission) {
                throw new UnauthorizedException("Forbidden: You do not have permission to perform this action.");
            }
        }

        return true;
    }
}

package com.hirematch.security;

import com.hirematch.enums.Role;
import java.lang.annotation.*;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequireRole {
    Role[] value() default {};
}

package com.financeTracking.Fintrack.Security.Controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/secure")
public class SecureController {


    @GetMapping("/hello")
    public String hello() {
        return "Hello authenticated user";
    }


    @GetMapping("/admin-only")
    @PreAuthorize("hasRole('ADMIN')")
    public String admin() {
        return "Hello admin";
    }
}
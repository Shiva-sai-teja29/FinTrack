package com.financeTracking.Fintrack.AuthService.DTOs;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthEmailRequest {
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    public AuthEmailRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public AuthEmailRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}


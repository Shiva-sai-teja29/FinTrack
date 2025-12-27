package com.financeTracking.Fintrack.ExceptionHandler;

public class JwtAuthenticationException extends RuntimeException {
    public JwtAuthenticationException(String message) {
        super(message);
    }
}

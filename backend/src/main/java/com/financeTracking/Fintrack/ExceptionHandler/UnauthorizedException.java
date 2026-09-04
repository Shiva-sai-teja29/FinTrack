package com.financeTracking.Fintrack.ExceptionHandler;

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}


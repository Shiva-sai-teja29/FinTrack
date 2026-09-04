package com.financeTracking.Fintrack.ExceptionHandler;

public class FileStorageException extends RuntimeException {
    public FileStorageException(String message, Throwable cause) {
        super(message, cause);
    }
}

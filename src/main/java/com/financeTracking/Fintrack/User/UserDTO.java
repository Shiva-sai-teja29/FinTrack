package com.financeTracking.Fintrack.User;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nullable;

import java.time.LocalDateTime;


public class UserDTO {
    private String username;
    private String email;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean transactions;
    private boolean budgets;

    private long transactionCount;
    public UserDTO(String username, String email, LocalDateTime createdAt, LocalDateTime updatedAt, boolean transactions, boolean budgets, String password) {
        this.username = username;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.transactions = transactions;
        this.budgets = budgets;

    }

    public UserDTO() {
    }

    public UserDTO(String username, String email, LocalDateTime createdAt, LocalDateTime updatedAt, boolean transactions, boolean budgets, long transactionCount) {
        this.username = username;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.transactions = transactions;
        this.budgets = budgets;
        this.transactionCount = transactionCount;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isTransactions() {
        return transactions;
    }

    public void setTransactions(boolean transactions) {
        this.transactions = transactions;
    }

    public boolean isBudgets() {
        return budgets;
    }

    public void setBudgets(boolean budgets) {
        this.budgets = budgets;
    }
}

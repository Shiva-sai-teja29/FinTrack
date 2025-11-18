package com.financeTracking.Fintrack.AnalyticsService.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.financeTracking.Fintrack.AuthService.entities.User;
import jakarta.persistence.*;

@Entity
@Table(name = "budgets")
public class Budget {
    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

    @Column(name = "budget_month")
    private String month; // "2025-11"

    private Double monthlyLimit;
    // getters/setters

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public Double getMonthlyLimit() {
        return monthlyLimit;
    }

    public void setMonthlyLimit(Double monthlyLimit) {
        this.monthlyLimit = monthlyLimit;
    }

    public Budget() {
    }

    public Budget(Long id, User user, String month, Double monthlyLimit) {
        this.id = id;
        this.user = user;
        this.month = month;
        this.monthlyLimit = monthlyLimit;
    }
}
package com.financeTracking.Fintrack.User.entity;

import com.financeTracking.Fintrack.AuthService.entities.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;
    private LocalDateTime expiryDate;
    private LocalDateTime createdAt;
    @OneToOne
    @JoinColumn(
            name = "user_id",           // column in token table
            unique = true
    )
    private User user;

    public PasswordResetToken(Long id, String token, LocalDateTime expiryDate, LocalDateTime createdAt, User user) {
        this.id = id;
        this.token = token;
        this.expiryDate = expiryDate;
        this.createdAt = createdAt;
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public PasswordResetToken() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
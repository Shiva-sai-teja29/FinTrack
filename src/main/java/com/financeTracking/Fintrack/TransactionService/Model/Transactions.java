package com.financeTracking.Fintrack.TransactionService.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.financeTracking.Fintrack.AuthService.entities.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
public class Transactions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)  // Foreign Key
    @JsonBackReference
    private User user;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type; // INCOME or EXPENSE

    private String description;
    private String receiptPath;

    public Transactions() {
    }

    public String getReceiptPath() {
        return receiptPath;
    }

    public void setReceiptPath(String receiptPath) {
        this.receiptPath = receiptPath;
    }

    public Transactions(Long id, User user, String category, Double amount, LocalDate date, TransactionType type, String description) {
        this.id = id;
        this.user = user;
        this.category = category;
        this.amount = amount;
        this.date = date;
        this.type = type;
        this.description = description;
    }

    public Transactions(Long id, User user, String category, Double amount, LocalDate date, TransactionType type, String description, String receiptPath) {
        this.id = id;
        this.user = user;
        this.category = category;
        this.amount = amount;
        this.date = date;
        this.type = type;
        this.description = description;
        this.receiptPath = receiptPath;
    }

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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}

package com.financeTracking.Fintrack.AnalyticsService.dto;

public record MonthlySummaryDTO(
        String month,         // "2025-11"
        Double totalIncome,
        Double totalExpense,
        Double netBalance,    // income - expense
        Double budgetLimit,   // null if none
        Double budgetRemaining // budgetLimit - totalExpense (null if no budget)
) { }

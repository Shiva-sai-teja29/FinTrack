package com.financeTracking.Fintrack.AnalyticsService;

public class BudgetLimitDTO {

    private String month; // "2025-11"

    private Double monthlyLimit;

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
}

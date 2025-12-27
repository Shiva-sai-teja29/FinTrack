package com.financeTracking.Fintrack.AnalyticsService;

import com.financeTracking.Fintrack.AnalyticsService.dto.CategorySummaryDTO;
import com.financeTracking.Fintrack.AnalyticsService.dto.MonthlySummaryDTO;
import com.financeTracking.Fintrack.AnalyticsService.model.Budget;
import com.financeTracking.Fintrack.AnalyticsService.repo.BudgetRepository;
import com.financeTracking.Fintrack.AuthService.entities.User;
import com.financeTracking.Fintrack.ExceptionHandler.ResourceNotFoundException;
import com.financeTracking.Fintrack.TransactionService.Repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final TransactionRepository txRepo;
    private final BudgetRepository budgetRepo;

    public AnalyticsService(TransactionRepository txRepo, BudgetRepository budgetRepo) {
        this.txRepo = txRepo;
        this.budgetRepo = budgetRepo;
    }

    private LocalDate monthStart(YearMonth ym) {
        return ym.atDay(1);
    }
    private LocalDate monthEnd(YearMonth ym) {
        return ym.atEndOfMonth();
    }

    @Transactional(readOnly = true)
    public MonthlySummaryDTO getMonthlySummary(User user, YearMonth month) {

        if (user == null) throw new ResourceNotFoundException("User not found");

        LocalDate from = monthStart(month);
        LocalDate to = monthEnd(month);

        Double income = txRepo.sumIncomeForUserBetween(user.getId(), from, to);
        Double expense = txRepo.sumExpenseForUserBetween(user.getId(), from, to);

        // handle null safety (COALESCE in query already ensures non-null, but safe anyway)
        income = income == null ? 0.0 : income;
        expense = expense == null ? 0.0 : expense;

        Double net = income - expense;

        String monthStr = month.toString(); // e.g., "2025-11"

        Double budgetLimit = budgetRepo.findByUserAndMonth(user, monthStr)
                .map(Budget::getMonthlyLimit).orElse(null);

        Double budgetRemaining = null;
        if (budgetLimit != null) {
            budgetRemaining = budgetLimit - expense;
        }

        return new MonthlySummaryDTO(monthStr, income, expense, net, budgetLimit, budgetRemaining);
    }

    @Transactional(readOnly = true)
    public List<CategorySummaryDTO> getCategoryExpenseSplit(Long userId, YearMonth month) {

        if (userId == null) throw new ResourceNotFoundException("User not found");

        LocalDate from = monthStart(month);
        LocalDate to = monthEnd(month);

        List<Object[]> rows = txRepo.categoryExpenseSums(userId, from, to);

        return rows.stream()
                .map(r -> new CategorySummaryDTO((String) r[0], ((Number) r[1]).doubleValue()))
                .collect(Collectors.toList());
    }

    // optionally: combined category sums for both types
    @Transactional(readOnly = true)
    public List<CategorySummaryDTO> getCategorySplitAllTypes(Long userId, YearMonth month) {
        if (userId == null) throw new ResourceNotFoundException("User ID is required");
        LocalDate from = monthStart(month);
        LocalDate to = monthEnd(month);

        var rows = txRepo.categorySumsAllTypes(userId, from, to);
        return rows.stream()
                .map(r -> new CategorySummaryDTO((String) r[0], ((Number) r[1]).doubleValue()))
                .collect(Collectors.toList());
    }

    public BudgetLimitDTO addMonthlyLimit(User user, BudgetLimitDTO monthlyLimit) {

        if (user == null) throw new ResourceNotFoundException("User not found");
        if (monthlyLimit == null) throw new IllegalArgumentException("Monthly limit data is required");


        Budget budget = new Budget();
        budget.setMonthlyLimit(monthlyLimit.getMonthlyLimit());
        budget.setMonth(monthlyLimit.getMonth());
        budget.setUser(user);
        List<Budget> budgets = user.getBudgets();
        budgets.add(budget);
        user.setBudgets(budgets);
        budgetRepo.save(budget);
        return monthlyLimit;
    }

    public Optional<Budget> getMonthlyLimit(User user, YearMonth ym) {

        if (user == null) throw new ResourceNotFoundException("User not found");

        String monthStr = ym.toString();

        return budgetRepo.findByUserAndMonth(user, monthStr);
    }

    public List<Budget> getAllMonthsLimit(User user) {
        if (user == null) throw new ResourceNotFoundException("User not found");
        return budgetRepo.findByUserId(user.getId());
    }

    public BudgetLimitDTO updateMonthlyLimit(User user, BudgetLimitDTO monthlyLimit) {

        if (user == null) throw new ResourceNotFoundException("User not found");
        if (monthlyLimit == null) throw new IllegalArgumentException("Monthly limit data is required");

        Optional<Budget> budget = budgetRepo.findByUserAndMonth(user, monthlyLimit.getMonth());
        if (budget.isEmpty()) {
            throw new ResourceNotFoundException("Budget not found for month: " + monthlyLimit.getMonth());
        }
        Budget existingBudget = budget.get();
        existingBudget.setMonthlyLimit(monthlyLimit.getMonthlyLimit());
        existingBudget.setMonth(monthlyLimit.getMonth());

        List<Budget> budgets = user.getBudgets();
        budgets.add(existingBudget);
        user.setBudgets(budgets);
        budgetRepo.save(existingBudget);
        return monthlyLimit;

    }
}
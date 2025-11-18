package com.financeTracking.Fintrack.AnalyticsService.repo;

import com.financeTracking.Fintrack.AnalyticsService.model.Budget;
import com.financeTracking.Fintrack.AuthService.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
//    Optional<Budget> findByUserIdAndMonth(Long userId, String month); // month "2025-11"
    Optional<Budget> findByUserAndMonth(User user, String month);

    List<Budget> findByUserId(Long id);
}
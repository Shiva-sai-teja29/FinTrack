package com.financeTracking.Fintrack.TransactionService.Repository;

import com.financeTracking.Fintrack.TransactionService.Model.Transactions;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transactions, Long> {
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transactions t "
            + "WHERE t.user.id = :userId AND t.type = com.financeTracking.Fintrack.TransactionService.Model.TransactionType.INCOME "
            + "AND t.date >= :from AND t.date <= :to")
    Double sumIncomeForUserBetween(@Param("userId") Long userId,
                                   @Param("from") LocalDate from,
                                   @Param("to") LocalDate to);

    // Sum of amounts where type = EXPENSE for given user and month range
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transactions t "
            + "WHERE t.user.id = :userId AND t.type = com.financeTracking.Fintrack.TransactionService.Model.TransactionType.EXPENSE "
            + "AND t.date >= :from AND t.date <= :to")
    Double sumExpenseForUserBetween(@Param("userId") Long userId,
                                    @Param("from") LocalDate from,
                                    @Param("to") LocalDate to);

    // Category-wise sums for EXPENSE (or INCOME if needed)
    @Query("SELECT t.category as category, COALESCE(SUM(t.amount),0) as total FROM Transactions t "
            + "WHERE t.user.id = :userId AND t.type = com.financeTracking.Fintrack.TransactionService.Model.TransactionType.EXPENSE "
            + "AND t.date >= :from AND t.date <= :to "
            + "GROUP BY t.category ORDER BY total DESC")
    List<Object[]> categoryExpenseSums(@Param("userId") Long userId,
                                       @Param("from") LocalDate from,
                                       @Param("to") LocalDate to);

    // Optionally category-wise combined INCOME+EXPENSE sums (if needed)
    @Query("SELECT t.category as category, COALESCE(SUM(t.amount),0) as total FROM Transactions t "
            + "WHERE t.user.id = :userId AND t.date >= :from AND t.date <= :to "
            + "GROUP BY t.category ORDER BY total DESC")
    List<Object[]> categorySumsAllTypes(@Param("userId") Long userId,
                                        @Param("from") LocalDate from,
                                        @Param("to") LocalDate to);

    Optional<Transactions> findByIdAndUserId(Long id, Long userId);

    List<Transactions> findByUserId(Long userId);

    @Query("SELECT COUNT(t) FROM Transactions t WHERE t.user.id = :userId")
    long countByUserId(Long userId);

}

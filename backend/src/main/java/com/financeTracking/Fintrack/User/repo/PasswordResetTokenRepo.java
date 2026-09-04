package com.financeTracking.Fintrack.User.repo;

import com.financeTracking.Fintrack.AuthService.entities.User;
import com.financeTracking.Fintrack.User.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepo extends JpaRepository<PasswordResetToken,Long> {
    Optional<PasswordResetToken> findByUserId(Long id);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.expiryDate < :now")
    int deleteByExpiryDateBefore(@Param("now") LocalDateTime now);

    Optional<PasswordResetToken> findByUserAndExpiryDateAfter(User user, LocalDateTime time);
}

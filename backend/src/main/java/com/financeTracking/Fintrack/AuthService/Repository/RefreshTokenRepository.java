package com.financeTracking.Fintrack.AuthService.Repository;

import com.financeTracking.Fintrack.AuthService.entities.RefreshToken;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Modifying
    @Query("DELETE FROM RefreshToken t WHERE t.expiryDate < :now")
    int deleteByExpiryDateBefore(@Param("now") Instant now);
}

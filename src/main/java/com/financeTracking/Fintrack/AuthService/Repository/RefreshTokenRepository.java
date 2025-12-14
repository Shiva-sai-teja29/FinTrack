package com.financeTracking.Fintrack.AuthService.Repository;

import com.financeTracking.Fintrack.AuthService.entities.RefreshToken;
import com.financeTracking.Fintrack.AuthService.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
}

package com.financeTracking.Fintrack.AuthService.Repository;

import com.financeTracking.Fintrack.AuthService.entities.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist, Long> {
    Optional<TokenBlacklist> findByToken(String token);
}


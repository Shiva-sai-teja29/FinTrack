package com.financeTracking.Fintrack.AuthService.Service;

import com.financeTracking.Fintrack.AuthService.Repository.TokenBlacklistRepository;
import com.financeTracking.Fintrack.AuthService.entities.TokenBlacklist;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TokenBlacklistService {

    private final TokenBlacklistRepository tokenBlacklistRepository;

    // Save token on logout
    public void blacklistToken(String token) {
        TokenBlacklist tb = TokenBlacklist.builder()
                .token(token)
                .expired(true)
                .revoked(true)
                .build();

        tokenBlacklistRepository.save(tb);
    }

    // Check if token is blacklisted
    public boolean isTokenBlacklisted(String token) {
        return tokenBlacklistRepository.findByToken(token).isPresent();
    }
}


package com.financeTracking.Fintrack.AuthService.Service;

import com.financeTracking.Fintrack.AuthService.DTOs.TokenRefreshRequest;
import com.financeTracking.Fintrack.AuthService.Repository.RefreshTokenRepository;
import com.financeTracking.Fintrack.AuthService.Repository.UserRepository;
import com.financeTracking.Fintrack.AuthService.entities.RefreshToken;
import com.financeTracking.Fintrack.AuthService.entities.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {

    @Value("${security.jwtRefreshExpirationMs}") // default 7 days
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository,
                               UserRepository userRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
    }

    public RefreshToken createRefreshToken(Long userId) {
        RefreshToken refreshToken = new RefreshToken();
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken = refreshTokenRepository.save(refreshToken);
        return refreshToken;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new sign-in request");
        }
        return token;
    }

//    @Transactional
//    public String deleteById(TokenRefreshRequest request) {
////        User user = userRepository.findById(userId).orElseThrow();
////        return refreshTokenRepository.deleteByUserId(userId);
//        String requestRefreshToken = request.getRefreshToken();
//        if (findByToken(requestRefreshToken).isPresent()){
//            Long id = findByToken(requestRefreshToken).get().getId();
//            refreshTokenRepository.deleteById(id);
//            return "Logout Successful";
//        }
//        return "Unsuccessful";
//    }
}

package com.financeTracking.Fintrack.Config;

import com.financeTracking.Fintrack.AuthService.Repository.RefreshTokenRepository;
import com.financeTracking.Fintrack.User.repo.PasswordResetTokenRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class ScheduledJobs {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledJobs.class);

    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetTokenRepo tokenRepo;
    private final JdbcTemplate jdbcTemplate;

    public ScheduledJobs(RefreshTokenRepository refreshTokenRepository,
                         PasswordResetTokenRepo tokenRepo, JdbcTemplate jdbcTemplate) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.tokenRepo = tokenRepo;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void deleteExpiredRefreshTokens() {
        try {
            int deletedCount = refreshTokenRepository.deleteByExpiryDateBefore(Instant.now());
            logger.info("Deleted {} expired refresh tokens", deletedCount);
        }catch (Exception e){
            logger.error("Refresh tokens deletion got an error: {}",e.getMessage());
        }

    }

    @Scheduled(cron = "0 0 * * * *")  // every hour
    @Transactional
    public void deleteExpiredTokens() {
        try {
            int deleted = tokenRepo.deleteByExpiryDateBefore(LocalDateTime.now(ZoneOffset.UTC));
            logger.info("Deleted {} expired tokens", deleted);
        }catch (Exception e){
            logger.error("OTP tokens deletion got an error: {}",e.getMessage());
        }
    }

    @Scheduled(fixedRate = 240000) // every 4 minutes
    public void keepDatabaseAlive() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            logger.info("DB Keep Alive Ping: {}", result);
        }catch (Exception e){
            logger.error("DB pinging got an error: {}",e.getMessage());
        }

    }
}

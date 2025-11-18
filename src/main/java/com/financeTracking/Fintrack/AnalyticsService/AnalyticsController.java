package com.financeTracking.Fintrack.AnalyticsService;

import com.financeTracking.Fintrack.AnalyticsService.dto.CategorySummaryDTO;
import com.financeTracking.Fintrack.AnalyticsService.dto.MonthlySummaryDTO;
import com.financeTracking.Fintrack.AnalyticsService.model.Budget;
import com.financeTracking.Fintrack.AuthService.entities.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    // Example: GET /api/analytics/summary?month=2025-11
    @GetMapping("/summary")
    public ResponseEntity<MonthlySummaryDTO> getMonthlySummary(
            Authentication authentication,
            @RequestParam("month") String month // format "YYYY-MM"
    ) {
//        Long userId = extractUserId(authentication);
        User user = extractUser();
        YearMonth ym = YearMonth.parse(month);
        MonthlySummaryDTO dto = analyticsService.getMonthlySummary(user, ym);
        return ResponseEntity.ok(dto);
    }

    // GET /api/analytics/category-split?month=2025-11
    @GetMapping("/category-split")
    public ResponseEntity<List<CategorySummaryDTO>> getCategorySplit(
            Authentication authentication,
            @RequestParam("month") String month
    ) {
//        Long userId = extractUserId(authentication);
        Long userId = extractUser().getId();
        YearMonth ym = YearMonth.parse(month);
        List<CategorySummaryDTO> list = analyticsService.getCategoryExpenseSplit(userId, ym);
        return ResponseEntity.ok(list);
    }
    @PostMapping("/monthlyLimit")
    public ResponseEntity<BudgetLimitDTO> monthlyLimit(Authentication authentication, @RequestBody BudgetLimitDTO monthlyLimit){
        User user = extractUser();
        return new ResponseEntity<>(analyticsService.addMonthlyLimit(user, monthlyLimit), HttpStatus.CREATED);
    }

    @GetMapping("/monthlyLimit/{month}")
    public ResponseEntity<Optional<Budget>> getMonthlyLimit(Authentication authentication, @PathVariable String month){
        User user = extractUser();
        YearMonth ym = YearMonth.parse(month);
        return new ResponseEntity<>(analyticsService.getMonthlyLimit(user, ym), HttpStatus.OK);
    }

    @GetMapping("/monthlyLimit")
    public ResponseEntity<List<Budget>> getAllMonthsLimit(Authentication authentication){
        User user = extractUser();
        return ResponseEntity.ok(analyticsService.getAllMonthsLimit(user));
    }

    @PutMapping("/monthlyLimit")
    public ResponseEntity<BudgetLimitDTO> updateMonthlyLimit(Authentication authentication, @RequestBody BudgetLimitDTO monthlyLimit){
        User user = extractUser();
        return new ResponseEntity<>(analyticsService.updateMonthlyLimit(user, monthlyLimit), HttpStatus.CREATED);
    }

    public User extractUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) auth.getPrincipal();
        return user;
    }

//
//    private Long extractUserId(Authentication authentication) {
//        // Example: if you stored userId as principal or in claims.
//        // Adjust according to your Security setup.
//        if (authentication == null) {
//            throw new IllegalStateException("Unauthenticated");
//        }
//
//        Object principal = authentication.getPrincipal();
//        // If principal is a custom UserDetails with getId()
//        if (principal instanceof com.financeTracking.Fintrack.AuthService.CustomUserDetailsService) {
//            return ((com.financeTracking.Fintrack.AuthService.CustomUserDetailsService) principal).getId();
//        }
//
//        // If Authentication contains claims map (e.g., from JwtAuthenticationToken)
//        if (authentication.getPrincipal() instanceof org.springframework.security.oauth2.jwt.Jwt jwt) {
//            return jwt.getClaim("userId");
//        }
//
//        // Fallback: try name as numeric id (not recommended)
//        try {
//            return Long.parseLong(authentication.getName());
//        } catch (NumberFormatException ex) {
//            throw new IllegalStateException("Unable to extract userId from Authentication");
//        }
//    }
}

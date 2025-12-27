package com.financeTracking.Fintrack.AuthService.Controller;

import com.financeTracking.Fintrack.AuthService.DTOs.*;
import com.financeTracking.Fintrack.AuthService.JwtService;
import com.financeTracking.Fintrack.AuthService.Repository.RefreshTokenRepository;
import com.financeTracking.Fintrack.AuthService.Repository.UserRepository;
import com.financeTracking.Fintrack.AuthService.Service.RefreshTokenService;
//import com.financeTracking.Fintrack.AuthService.Service.TokenBlacklistService;
import com.financeTracking.Fintrack.AuthService.entities.RefreshToken;
import com.financeTracking.Fintrack.AuthService.entities.User;
import com.financeTracking.Fintrack.User.UserPreference.DefaultPreferences;
import com.financeTracking.Fintrack.User.UserPreference.UserPreferences;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    private final RefreshTokenRepository refreshTokenRepository;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PasswordEncoder passwordEncoder, JwtService jwtService, RefreshTokenService refreshTokenService, RefreshTokenRepository refreshTokenRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
        //this.tokenBlacklistService = tokenBlacklistService;
        this.refreshTokenRepository = refreshTokenRepository;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
// Load user
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Generate ACCESS token
        String accessToken = jwtService.generateToken(
                user.getUsername(),
                user.getRoles().stream().toList()
        );

        // Generate REFRESH token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        // Prepare response
        AuthResponse resp = new AuthResponse();
        resp.setToken(accessToken);
        resp.setRefreshToken(refreshToken.getToken());

        return ResponseEntity.ok(resp);
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }


        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }


        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRoles(Collections.singleton("ROLE_USER"));

        UserPreferences prefs = new UserPreferences();
        prefs.setCurrency(DefaultPreferences.DEFAULT_CURRENCY);
        prefs.setTimezone(DefaultPreferences.DEFAULT_TIMEZONE);
        prefs.setLanguage(DefaultPreferences.DEFAULT_LANGUAGE);
        prefs.setEmailNotifications(DefaultPreferences.EMAIL_NOTIFICATIONS);
        prefs.setPushNotifications(DefaultPreferences.PUSH_NOTIFICATIONS);

        user.setPreferences(prefs);

        userRepository.save(user);


        return ResponseEntity.ok(Map.of("message", "User created"));
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {

                    String newAccessToken =
                            jwtService.generateToken(
                                    user.getUsername(),
                                    user.getRoles().stream().toList()
                            );

                    RefreshToken newRefreshToken =
                            refreshTokenService.createRefreshToken(user.getId());

                    return ResponseEntity.ok(
                            new TokenRefreshResponse(newAccessToken, newRefreshToken.getToken())
                    );

                })
                .orElseGet(() -> ResponseEntity
                        .badRequest()
                        .body(new TokenRefreshResponse(null, null)));
    }
    
    @Transactional
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(@RequestBody TokenRefreshRequest request, HttpServletRequest req) {
        String requestToken = request.getRefreshToken();
        String authHeader = req.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ") || requestToken == null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
        String token = authHeader.substring(7);
//        tokenBlacklistService.blacklistToken(token);

        String requestRefreshToken = request.getRefreshToken();
        if (refreshTokenService.findByToken(requestRefreshToken).isPresent()) {
            Long id = refreshTokenService.findByToken(requestRefreshToken).get().getId();
            refreshTokenRepository.deleteById(id);
            return ResponseEntity.ok().body("Log out successful!");
        }
        return ResponseEntity.badRequest().body("Refresh token not found!");
    }


    // Simple handler to convert validation errors to JSON
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(err -> errors.put(err.getField(), err.getDefaultMessage()));
        return ResponseEntity.badRequest().body(errors);
    }
}

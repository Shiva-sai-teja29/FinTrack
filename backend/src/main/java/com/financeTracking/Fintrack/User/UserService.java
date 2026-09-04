package com.financeTracking.Fintrack.User;

import com.financeTracking.Fintrack.AuthService.Repository.UserRepository;
import com.financeTracking.Fintrack.AuthService.entities.User;
import com.financeTracking.Fintrack.TransactionService.Repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    public UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public TransactionRepository transactionRepository;
    @Autowired
    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       TransactionRepository transactionRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.transactionRepository = transactionRepository;
    }

    public UserDTO getDetails() {
        User user = extractUser();
        UserDTO userDTO = new UserDTO();
        userDTO.setEmail(user.getEmail());
        userDTO.setBudgets(!user.getBudgets().isEmpty());
        userDTO.setCreatedAt(user.getCreatedAt());
        userDTO.setTransactions(!user.getTransactions().isEmpty());
        userDTO.setUsername(user.getUsername());
        userDTO.setUpdatedAt(user.getUpdatedAt());
        userDTO.setTransactionCount(transactionRepository.countByUserId(user.getId()));

        return userDTO;
    }

    public User extractUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (User) auth.getPrincipal();
    }

    public String updateDetails(UpdateUser request) {
        User loggedInUser = extractUser();
        User user1 = userRepository.findByUsername(loggedInUser.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found : "+loggedInUser.getUsername()));

        // ✅ Verify OLD password
        if (!passwordEncoder.matches(request.getOldPassword(), user1.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        // ✅ Update password
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            user1.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        // ✅ Update username
        if (request.getNewUsername() != null && !request.getNewUsername().isBlank()) {
            if (userRepository.existsByUsername(request.getNewUsername())) {
                throw new RuntimeException("Username already exists");
            }
            user1.setUsername(request.getNewUsername());
        }

        // ✅ Update email
        if (request.getNewEmail() != null && !request.getNewEmail().isBlank()) {
            if (userRepository.existsByEmail(request.getNewEmail())) {
                throw new RuntimeException("Email already exists");
            }
            user1.setEmail(request.getNewEmail());
        }

        userRepository.save(user1);
        return "Updated";
    }
}

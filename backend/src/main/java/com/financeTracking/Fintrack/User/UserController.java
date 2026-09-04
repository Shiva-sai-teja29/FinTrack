package com.financeTracking.Fintrack.User;

import com.financeTracking.Fintrack.User.service.PasswordService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    public UserService userService;
    private final PasswordService passwordService;

    @Autowired
    public UserController(UserService userService, PasswordService passwordService) {
        this.userService = userService;
        this.passwordService = passwordService;
    }

    @GetMapping("/user")
    public ResponseEntity<UserDTO> userDetails(Authentication authentication){
        return ResponseEntity.ok(userService.getDetails());
    }

    @PutMapping("/user")
    public ResponseEntity<String> updateDetails(Authentication authentication, @RequestBody UpdateUser user){
        return new ResponseEntity<>(userService.updateDetails(user), HttpStatus.CREATED);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String mail) throws MessagingException {
        passwordService.createTokenAndSendMail(mail);
        return ResponseEntity.ok("Reset token sent to mail");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String mail,
            @RequestParam String token,
            @RequestParam String newPassword) {
        passwordService.resetPassword(mail,token,newPassword);
        return ResponseEntity.ok("Password updated successfully");
    }
}

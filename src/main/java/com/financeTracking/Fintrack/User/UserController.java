package com.financeTracking.Fintrack.User;

import com.financeTracking.Fintrack.AuthService.entities.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    public UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public ResponseEntity<UserDTO> userDetails(Authentication authentication){
        return ResponseEntity.ok(userService.getDetails());
    }

    @PutMapping("/user")
    public ResponseEntity<String> updateDetails(Authentication authentication, @RequestBody UpdateUser user){
        return new ResponseEntity<>(userService.updateDetails(user), HttpStatus.CREATED);
    }
}

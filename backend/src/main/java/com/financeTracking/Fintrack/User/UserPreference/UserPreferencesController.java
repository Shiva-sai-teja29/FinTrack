package com.financeTracking.Fintrack.User.UserPreference;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api")
public class UserPreferencesController {

    private final UserPreferencesService service;

    public UserPreferencesController(UserPreferencesService service) {
        this.service = service;
    }


    @GetMapping("/users/preferences")
    public ResponseEntity<UserPreferencesDTO> getPreferences(Principal principal) {
        return ResponseEntity.ok(
                service.getPreferences(principal.getName())
        );
    }


    @PutMapping("/users/preferences")
    public ResponseEntity<Void> updatePreferences(
            @RequestBody UserPreferencesDTO dto
    ) {
        service.saveOrUpdatePreferences(dto);
        return ResponseEntity.ok().build();
    }
}


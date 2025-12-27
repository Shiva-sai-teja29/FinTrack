package com.financeTracking.Fintrack.User.UserPreference;



import com.financeTracking.Fintrack.AuthService.Repository.UserRepository;
import com.financeTracking.Fintrack.AuthService.entities.User;
import com.financeTracking.Fintrack.ExceptionHandler.UnauthorizedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserPreferencesService {

    private final UserRepository userRepository;

    public UserPreferencesService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserPreferencesDTO getPreferences(String username) {
        User user = extractUser();

        UserPreferences prefs = user.getPreferences();
        if (prefs == null) {
            return new UserPreferencesDTO(); // empty defaults
        }

        return mapToDTO(prefs);
    }

    public void saveOrUpdatePreferences(UserPreferencesDTO dto) {
        User user = extractUser();

        UserPreferences prefs = user.getPreferences();
        if (prefs == null) {
            prefs = new UserPreferences();
        }

        applyDTO(prefs, dto);
        user.setPreferences(prefs);

        userRepository.save(user);
    }

    /* ---------------- HELPERS ---------------- */

    private User getUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    private UserPreferencesDTO mapToDTO(UserPreferences prefs) {
        UserPreferencesDTO dto = new UserPreferencesDTO();
        dto.setCurrency(prefs.getCurrency().name());
        dto.setTimezone(prefs.getTimezone().name());
        dto.setLanguage(prefs.getLanguage());
        dto.setEmailNotifications(prefs.getEmailNotifications());
        dto.setPushNotifications(prefs.getPushNotifications());
        return dto;
    }

    private void applyDTO(UserPreferences prefs, UserPreferencesDTO dto) {
        if (dto.getCurrency() != null) {
            prefs.setCurrency(CurrencyEnum.valueOf(dto.getCurrency()));
        }

        if (dto.getTimezone() != null) {
            prefs.setTimezone(TimeZoneEnum.valueOf(dto.getTimezone()));
        }

        if (dto.getLanguage() != null) {
            prefs.setLanguage(dto.getLanguage());
        }

        if (dto.getEmailNotifications() != null) {
            prefs.setEmailNotifications(dto.getEmailNotifications());
        }

        if (dto.getPushNotifications() != null) {
            prefs.setPushNotifications(dto.getPushNotifications());
        }
    }
    public User extractUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()
                || auth.getPrincipal().equals("anonymousUser")) {
            throw new UnauthorizedException("User not authenticated");
        }
        return (User) auth.getPrincipal();
    }
}




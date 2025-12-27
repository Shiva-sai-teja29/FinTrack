package com.financeTracking.Fintrack.User.UserPreference;

public class UserPreferencesDTO {

    private String currency;
    private String timezone;
    private String language;

    private Boolean emailNotifications;
    private Boolean pushNotifications;

    // getters & setters

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Boolean getEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(Boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public Boolean getPushNotifications() {
        return pushNotifications;
    }

    public void setPushNotifications(Boolean pushNotifications) {
        this.pushNotifications = pushNotifications;
    }

    public UserPreferencesDTO() {
    }

    public UserPreferencesDTO(String currency, String timezone, String language, Boolean emailNotifications, Boolean pushNotifications) {
        this.currency = currency;
        this.timezone = timezone;
        this.language = language;
        this.emailNotifications = emailNotifications;
        this.pushNotifications = pushNotifications;
    }
}


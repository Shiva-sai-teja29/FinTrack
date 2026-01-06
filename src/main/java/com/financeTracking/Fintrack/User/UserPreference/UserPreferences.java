package com.financeTracking.Fintrack.User.UserPreference;

import jakarta.persistence.*;

import java.io.Serializable;

@Embeddable
public class UserPreferences implements Serializable {

    private static final long serialVersionUID = 1L;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CurrencyEnum currency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TimeZoneEnum timezone;

    private String language;

    private Boolean emailNotifications;
    private Boolean pushNotifications;

    // getters & setters

    public UserPreferences(CurrencyEnum currency, TimeZoneEnum timezone, String language, Boolean emailNotifications, Boolean pushNotifications) {
        this.currency = currency;
        this.timezone = timezone;
        this.language = language;
        this.emailNotifications = emailNotifications;
        this.pushNotifications = pushNotifications;
    }

    public CurrencyEnum getCurrency() {
        return currency;
    }

    public void setCurrency(CurrencyEnum currency) {
        this.currency = currency;
    }

    public TimeZoneEnum getTimezone() {
        return timezone;
    }

    public void setTimezone(TimeZoneEnum timezone) {
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

    public UserPreferences() {
    }
}



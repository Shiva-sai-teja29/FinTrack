package com.financeTracking.Fintrack.User.UserPreference;

public final class DefaultPreferences {

    public static final CurrencyEnum DEFAULT_CURRENCY = CurrencyEnum.INR;
    public static final TimeZoneEnum DEFAULT_TIMEZONE = TimeZoneEnum.ASIA_KOLKATA;
    public static final String DEFAULT_LANGUAGE = "en";

    public static final Boolean EMAIL_NOTIFICATIONS = true;
    public static final Boolean PUSH_NOTIFICATIONS = false;

    private DefaultPreferences() {}
}


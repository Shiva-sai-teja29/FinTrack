package com.financeTracking.Fintrack.User.UserPreference;

public enum TimeZoneEnum {

    // Asia
    ASIA_KOLKATA("Asia/Kolkata"),
    ASIA_DUBAI("Asia/Dubai"),
    ASIA_SINGAPORE("Asia/Singapore"),
    ASIA_TOKYO("Asia/Tokyo"),
    ASIA_SHANGHAI("Asia/Shanghai"),
    ASIA_HONG_KONG("Asia/Hong_Kong"),

    // Europe
    EUROPE_LONDON("Europe/London"),
    EUROPE_PARIS("Europe/Paris"),
    EUROPE_BERLIN("Europe/Berlin"),
    EUROPE_ROME("Europe/Rome"),

    // Americas
    AMERICA_NEW_YORK("America/New_York"),
    AMERICA_CHICAGO("America/Chicago"),
    AMERICA_DENVER("America/Denver"),
    AMERICA_LOS_ANGELES("America/Los_Angeles"),
    AMERICA_SAO_PAULO("America/Sao_Paulo"),

    // Africa
    AFRICA_JOHANNESBURG("Africa/Johannesburg"),
    AFRICA_CAIRO("Africa/Cairo"),

    // Oceania
    AUSTRALIA_SYDNEY("Australia/Sydney"),
    PACIFIC_AUCKLAND("Pacific/Auckland"),

    // Global
    UTC("UTC");

    private final String zoneId;

    TimeZoneEnum(String zoneId) {
        this.zoneId = zoneId;
    }

    public String getZoneId() {
        return zoneId;
    }
}


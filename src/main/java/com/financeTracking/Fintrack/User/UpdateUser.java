package com.financeTracking.Fintrack.User;

public class UpdateUser {
    private String oldPassword;
    private String newUsername;
    private String newEmail;
    private String newPassword;

    public UpdateUser(String oldPassword, String newUsername, String newEmail, String newPassword) {
        this.oldPassword = oldPassword;
        this.newUsername = newUsername;
        this.newEmail = newEmail;
        this.newPassword = newPassword;
    }

    public UpdateUser() {
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewUsername() {
        return newUsername;
    }

    public void setNewUsername(String newUsername) {
        this.newUsername = newUsername;
    }

    public String getNewEmail() {
        return newEmail;
    }

    public void setNewEmail(String newEmail) {
        this.newEmail = newEmail;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}

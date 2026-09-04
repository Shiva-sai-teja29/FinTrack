package com.financeTracking.Fintrack.AuthService.DTOs;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Username cannot be empty")
    @Size(min = 4,max = 30,message = "Username characters must contain greater than 4 and lesser than 30")
    private String username;

    @NotBlank(message = "Email cannot be empty")
    @Email
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8,max = 50,message = "Password contain at least 8 Characters")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@#$%^&+=!]).{8,}$",
            message = "Password must contain uppercase, lowercase, digit, and special character"
    )
    private String password;

    public RegisterRequest(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public RegisterRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

//class Student {
//    String name ;
//
//    public Student(String name){
//        this.name = name ;
//    }
//
//    public String getName(){
//        return this.name;
//    }
//}
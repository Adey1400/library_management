package com.example.Library_Book_Management.Auth;

import com.example.Library_Book_Management.User.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String firstname;
    private String lastname;
    private String email;
    private String password;
    private Role role; 
    private String currentYear;
    private String semester;

    private String department;
    private String rollNo;
}
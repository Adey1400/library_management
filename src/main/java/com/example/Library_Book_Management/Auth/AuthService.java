package com.example.Library_Book_Management.Auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.Library_Book_Management.Config.JWTService;
import com.example.Library_Book_Management.User.User; // Assuming your User entity is here
import com.example.Library_Book_Management.User.UserRepo;

@Service
public class AuthService {

    @Autowired
    private UserRepo repo;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JWTService jwtService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthResponse registerRequest(RegisterRequest request) {
      
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

      
        repo.save(user);

   
        var jwtToken = jwtService.generateToken(user);

 
        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }

    public AuthResponse authRequest(AuthRequest request) {
      
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );


        var user = repo.findByEmail(request.getEmail())
                .orElseThrow(); 


        var jwtToken = jwtService.generateToken(user);


        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }
}
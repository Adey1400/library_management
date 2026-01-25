package com.example.Library_Book_Management.Auth;

import com.example.Library_Book_Management.Config.JWTService;
import com.example.Library_Book_Management.Student.Student;
import com.example.Library_Book_Management.Student.StudentRepository;
import com.example.Library_Book_Management.User.Role;
import com.example.Library_Book_Management.User.User;
import com.example.Library_Book_Management.User.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepo userRepo;
    private final StudentRepository studentRepo;
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;

    @Transactional 
    public AuthResponse registerRequest(RegisterRequest request) {
      
        System.out.println("👉 Registering User: " + request.getEmail());

        User user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();



        User savedUser = userRepo.save(user);


        if (request.getRole() == Role.STUDENT) {
            System.out.println("👉 Creating Student Profile for: " + request.getRollNo());
            
            var student = Student.builder()
                    .name(request.getFirstname() + " " + request.getLastname())
                    .email(request.getEmail())
                    .department(request.getDepartment())
                    .rollNo(request.getRollNo())        
                    .user(savedUser)             
                    .build();
            
            studentRepo.save(student);
        }


        var jwtToken = jwtService.generateToken(user);
 

        return AuthResponse.builder()
                .token(jwtToken)
                .role(user.getRole().name()) 
                .name(user.getFirstname())   
                .build();                    
    }

    public AuthResponse authRequest(AuthRequest request) {
        System.out.println("👉 Login Attempt for: [" + request.getEmail() + "]");

        try {
         
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

      
            User user = userRepo.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("User found in Auth but not in DB"));

   
            var jwtToken = jwtService.generateToken(user);
            System.out.println("✅ Login Successful. Token Generated.");

            
            return AuthResponse.builder()
                    .token(jwtToken)
                    .role(user.getRole().name()) 
                    .name(user.getFirstname())  
                    .build();

        } catch (Exception e) {
            System.out.println("❌ Login Failed: " + e.getMessage());
            throw new BadCredentialsException("Invalid Email or Password");
        }
}
    }
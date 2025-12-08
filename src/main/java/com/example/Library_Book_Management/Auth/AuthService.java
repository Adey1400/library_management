package com.example.Library_Book_Management.Auth;

import com.example.Library_Book_Management.Config.JWTService;
import com.example.Library_Book_Management.Student.Student;
import com.example.Library_Book_Management.Student.StudentRepository;
import com.example.Library_Book_Management.User.Role;
import com.example.Library_Book_Management.User.User;
import com.example.Library_Book_Management.User.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor // Generates constructor for final fields (Cleaner than @Autowired)
public class AuthService {

    private final UserRepo userRepo;
    private final StudentRepository studentRepo; // 🟢 Inject Student Repo
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse registerRequest(RegisterRequest request) {
      
        // 1. Create and Save User (Login Credentials)
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

       
        User savedUser = userRepo.save(user);

     
        if (request.getRole() == Role.STUDENT) {
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
                .build();
    }

    public AuthResponse authRequest(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(); 

        var jwtToken = jwtService.generateToken(user);

        return AuthResponse.builder()
                .token(jwtToken)
                .build();
    }
}
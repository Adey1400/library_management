package com.example.Library_Book_Management.Config; 

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor 
public class SecurityConfiguration {

   
    private final JWTFilter jwtFilter;
    
    
    private final AuthenticationProvider authenticationProvider; 

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .cors(cors-> cors.configure(http))
            .authorizeHttpRequests(auth -> auth
            
                .requestMatchers("/register", "/login").permitAll() 
              
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
          
            .authenticationProvider(authenticationProvider) 
            
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
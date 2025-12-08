package com.example.Library_Book_Management.Student;

import com.example.Library_Book_Management.User.User;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder; 
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Profile Details
    private String name;       
    private String email;
    private String department;
    private String rollNo;
    
    @Builder.Default
    private LocalDate joinedDate = LocalDate.now();

    @OneToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;
}
package com.example.Library_Book_Management.Student;

import com.example.Library_Book_Management.Books.Books;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "students")
public class Student {

    @Id
    @SequenceGenerator(
            name = "student_sequence",
            sequenceName = "student_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "student_sequence"
    )
    private Long id;

    private String name;
    private String email;
    private String department;
    private String rollNo;
    private LocalDate joinedDate = LocalDate.now();

    // 🔗 Relationship: one student can have multiple books
    @OneToMany
    @JoinColumn(name = "student_id")
    private List<Books> borrowedBooks;
}

package com.example.Library_Book_Management.BookIssue;

import java.time.LocalDate;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.example.Library_Book_Management.Books.Books;
import com.example.Library_Book_Management.Student.Student; // Or User if you renamed it

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name="book_issue")
public class BookIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name="student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name="books_id", nullable = false)
    private Books book;

    // 🟢 NEW FIELDS
    private LocalDate requestDate; // When student clicked "Request"
    private LocalDate issueDate;   // When librarian clicked "Approve"
    private LocalDate dueDate;     // When the book must be returned
    private LocalDate returnDate;  // When it was actually returned

    @Enumerated(EnumType.STRING)
    private IssueStatus status;    // REQUESTED, ISSUED, RETURNED, REJECTED
}
package com.example.Library_Book_Management.Books;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "books")
public class Books {

    @Id
    @SequenceGenerator(
            name = "book_sequence",
            sequenceName = "book_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "book_sequence"
    )
    private Long id;

    private String bookName;
    private String author;
    private LocalDate issuedDate;
    private LocalDate returnDate;
    private Boolean isIssued = false;
    public Books(String bookName, String author) {
        this.bookName = bookName;
        this.author = author;
        this.isIssued = false;
    }
}

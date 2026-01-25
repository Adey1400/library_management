package com.example.Library_Book_Management.BookIssue;

import com.example.Library_Book_Management.Books.BooksRepository;
import com.example.Library_Book_Management.Student.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class BookIssueService {

    private final BookIssueRepository bookIssueRepository;
    private final BooksRepository booksRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public BookIssueService(BookIssueRepository bookIssueRepository, BooksRepository booksRepository, StudentRepository studentRepository) {
        this.bookIssueRepository = bookIssueRepository;
        this.booksRepository = booksRepository;
        this.studentRepository = studentRepository;
    }

    //Direct Issue by Roll No (For Librarian Manual Entry)
    public void issueBookDirectlyByRollNo(String rollNo, Long bookId) {
        var student = studentRepository.findByRollNo(rollNo)
                .orElseThrow(() -> new IllegalStateException("Student with Roll No '" + rollNo + "' not found"));
        
        var book = booksRepository.findById(bookId)
                .orElseThrow(() -> new IllegalStateException("Book not found"));

        // Check availability
        Long activeIssues = bookIssueRepository.countByBookIdAndStatusIn(
                bookId, 
                List.of(IssueStatus.REQUESTED, IssueStatus.ISSUED)
        );

        if (activeIssues >= book.getCopies()) {
            throw new IllegalStateException("All copies are currently busy.");
        }

        BookIssue issue = new BookIssue();
        issue.setStudent(student);
        issue.setBook(book);
        issue.setStatus(IssueStatus.ISSUED); // Directly ISSUED
        issue.setIssueDate(LocalDate.now());
        issue.setDueDate(LocalDate.now().plusDays(14)); // Set due date (e.g. 14 days)
        
        bookIssueRepository.save(issue);
    }

    // Direct librarian issues (using ID - keeping for compatibility)
    public void issueBookDirectly(Long studentId, Long bookId) {
        var student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalStateException("Student not found"));
        var book = booksRepository.findById(bookId)
                .orElseThrow(() -> new IllegalStateException("Book not found"));

        // Checking Availability
        Long activeIssues = bookIssueRepository.countByBookIdAndStatusIn(
                bookId, 
                List.of(IssueStatus.REQUESTED, IssueStatus.ISSUED)
        );

        if (activeIssues >= book.getCopies()) {
            throw new IllegalStateException("All copies are currently issued or requested.");
        }

        // Creating Record as ISSUED immediately
        BookIssue issue = new BookIssue();
        issue.setStudent(student);
        issue.setBook(book);
        issue.setStatus(IssueStatus.ISSUED); // Directly ISSUED
        issue.setIssueDate(LocalDate.now());
        issue.setDueDate(LocalDate.now().plusDays(14)); // Set due date
        
        bookIssueRepository.save(issue);
    }

    // STUDENT REQUESTS BOOK (Using Roll No)
    public void requestBook(String rollNo, Long bookId) {
        var student = studentRepository.findByRollNo(rollNo)
                .orElseThrow(() -> new IllegalStateException("Student not found"));
        var book = booksRepository.findById(bookId)
                .orElseThrow(() -> new IllegalStateException("Book not found"));
        
        Long activeIssues = bookIssueRepository.countByBookIdAndStatusIn(
                bookId, 
                List.of(IssueStatus.REQUESTED, IssueStatus.ISSUED)
        );
       
        if (activeIssues >= book.getCopies()) {
            throw new IllegalStateException("All copies of this book are currently issued or requested.");
        }
       
        BookIssue issue = new BookIssue();
        issue.setStudent(student);
        issue.setBook(book);
        issue.setStatus(IssueStatus.REQUESTED); 
        issue.setRequestDate(LocalDate.now());
        bookIssueRepository.save(issue);
    }

    // LIBRARIAN APPROVES
    public void approveIssue(Long issueId) {
        BookIssue issue = bookIssueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalStateException("Issue record not found"));

        if (issue.getStatus() != IssueStatus.REQUESTED) {
            throw new IllegalStateException("Can only approve REQUESTED books.");
        }

        issue.setStatus(IssueStatus.ISSUED);
        issue.setIssueDate(LocalDate.now());
        // Set due date (e.g., 14 days from now)
        issue.setDueDate(LocalDate.now().plusDays(14));
        bookIssueRepository.save(issue);
    }

    // LIBRARIAN REJECTS
    public void rejectRequest(Long issueId) {
        BookIssue issue = bookIssueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalStateException("Issue record not found"));
        issue.setStatus(IssueStatus.REJECTED);
        bookIssueRepository.save(issue);
    }

    // RETURN BOOK
    public void returnBook(Long issueId) {
        var issue = bookIssueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalStateException("Issue record not found"));

        issue.setStatus(IssueStatus.RETURNED);
        issue.setReturnDate(LocalDate.now());
        bookIssueRepository.save(issue);
    }

    // HELPER GETTERS
    public List<BookIssue> getAllIssuedBooks() {
        return bookIssueRepository.findAll();
    }

    public List<BookIssue> getPendingRequests() {
        return bookIssueRepository.findAllByStatus(IssueStatus.REQUESTED);
    }

    public List<BookIssue> getStudentHistory(Long studentId) {
        return bookIssueRepository.findAllByStudentId(studentId);
    }
}
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

    // 1. STUDENT REQUESTS BOOK
    public void requestBook(Long studentId, Long bookId) {
        var student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalStateException("Student not found"));
        var book = booksRepository.findById(bookId)
                .orElseThrow(() -> new IllegalStateException("Book not found"));

        // Check if book is already requested or issued to ANYONE (simple logic)
        // ideally, you check if copies > 0
        boolean isUnavailable = bookIssueRepository.existsByBookIdAndStatusIn(
                bookId, List.of(IssueStatus.REQUESTED, IssueStatus.ISSUED));

        if (isUnavailable) {
            throw new IllegalStateException("Book is currently unavailable or requested by someone else.");
        }

        BookIssue issue = new BookIssue();
        issue.setStudent(student);
        issue.setBook(book);
        issue.setStatus(IssueStatus.REQUESTED); // Initial Status
        issue.setRequestDate(LocalDate.now());
        bookIssueRepository.save(issue);
    }

    // 2. LIBRARIAN APPROVES
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

    // 3. LIBRARIAN REJECTS
    public void rejectRequest(Long issueId) {
        BookIssue issue = bookIssueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalStateException("Issue record not found"));
        issue.setStatus(IssueStatus.REJECTED);
        bookIssueRepository.save(issue);
    }

    // 4. RETURN BOOK
    public void returnBook(Long issueId) {
        var issue = bookIssueRepository.findById(issueId)
                .orElseThrow(() -> new IllegalStateException("Issue record not found"));

        issue.setStatus(IssueStatus.RETURNED);
        issue.setReturnDate(LocalDate.now());
        bookIssueRepository.save(issue);
    }

    // 5. HELPER GETTERS
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
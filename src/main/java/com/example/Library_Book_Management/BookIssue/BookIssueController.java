package com.example.Library_Book_Management.BookIssue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/issue")
// @CrossOrigin("*") // Uncomment this if not handled in WebConfig
public class BookIssueController {

    private final BookIssueService bookIssueService;

    @Autowired
    public BookIssueController(BookIssueService bookIssueService) {
        this.bookIssueService = bookIssueService;
    }

    // ==========================================
    // 🟢 STUDENT ENDPOINTS
    // ==========================================

    // 1. Student Requests a Book
    @PostMapping("/request/student/{studentId}/book/{bookId}")
    public ResponseEntity<String> requestBook(@PathVariable Long studentId, @PathVariable Long bookId) {
        try {
            bookIssueService.requestBook(studentId, bookId);
            return ResponseEntity.ok("Book requested successfully! Waiting for Librarian approval.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. Get history for a specific student (My Requests)
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<BookIssue>> getStudentHistory(@PathVariable Long studentId) {
        return ResponseEntity.ok(bookIssueService.getStudentHistory(studentId));
    }

    // ==========================================
    // 🔵 LIBRARIAN ENDPOINTS
    // ==========================================

    // 3. Get ALL Pending Requests (For Librarian Dashboard)
    @GetMapping("/pending")
    public ResponseEntity<List<BookIssue>> getPendingRequests() {
        return ResponseEntity.ok(bookIssueService.getPendingRequests());
    }

    // 4. Get ALL records (History/Logs)
    @GetMapping("/all")
    public ResponseEntity<List<BookIssue>> getAllTransactions() {
        return ResponseEntity.ok(bookIssueService.getAllIssuedBooks());
    }

    // 5. Approve a Request (Changes status REQUESTED -> ISSUED)
    @PutMapping("/approve/{issueId}")
    public ResponseEntity<String> approveRequest(@PathVariable Long issueId) {
        try {
            bookIssueService.approveIssue(issueId);
            return ResponseEntity.ok("Request approved. Book is now ISSUED.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 6. Reject a Request (Changes status REQUESTED -> REJECTED)
    @PutMapping("/reject/{issueId}")
    public ResponseEntity<String> rejectRequest(@PathVariable Long issueId) {
        bookIssueService.rejectRequest(issueId);
        return ResponseEntity.ok("Request rejected.");
    }

    // 7. Return a Book (Changes status ISSUED -> RETURNED)
    @PutMapping("/return/{issueId}")
    public ResponseEntity<String> returnBook(@PathVariable Long issueId) {
        bookIssueService.returnBook(issueId);
        return ResponseEntity.ok("Book returned successfully.");
    }
}
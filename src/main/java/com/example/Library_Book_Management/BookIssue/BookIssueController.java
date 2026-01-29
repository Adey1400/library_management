package com.example.Library_Book_Management.BookIssue;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/issue")

public class BookIssueController {

    private final BookIssueService bookIssueService;

    @Autowired
    public BookIssueController(BookIssueService bookIssueService) {
        this.bookIssueService = bookIssueService;
    }

    // ==========================================
    // 🟢 STUDENT ENDPOINTS
    // ==========================================


    @PostMapping("/request/book/{bookId}")
    public ResponseEntity<String> requestBook(
            @PathVariable Long bookId, 
            @RequestParam String rollNo 
    ) {
        try {
            bookIssueService.requestBook(rollNo, bookId);
            return ResponseEntity.ok("Book requested successfully!");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<BookIssue>> getStudentHistory(@PathVariable Long studentId) {
        return ResponseEntity.ok(bookIssueService.getStudentHistory(studentId));
    }

    // ==========================================
    // 🔵 LIBRARIAN ENDPOINTS
    // ==========================================

    
    @GetMapping("/pending")
    public ResponseEntity<List<BookIssue>> getPendingRequests() {
        return ResponseEntity.ok(bookIssueService.getPendingRequests());
    }

    @GetMapping("/active")
    public ResponseEntity<List<BookIssue>> getActiveIssues() {
    return ResponseEntity.ok(bookIssueService.getActiveIssues());
}

    @GetMapping("/all")
    public ResponseEntity<List<BookIssue>> getAllTransactions() {
        return ResponseEntity.ok(bookIssueService.getAllIssuedBooks());
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<BookIssue>> getMyHistory(@RequestParam String rollNo){
        return ResponseEntity.ok(bookIssueService.getStudentHistoryByRollNo(rollNo));
    }
    @PutMapping("/approve/{issueId}")
    public ResponseEntity<String> approveRequest(@PathVariable Long issueId) {
        try {
            bookIssueService.approveIssue(issueId);
            return ResponseEntity.ok("Request approved. Book is now ISSUED.");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PutMapping("/reject/{issueId}")
    public ResponseEntity<String> rejectRequest(@PathVariable Long issueId) {
        bookIssueService.rejectRequest(issueId);
        return ResponseEntity.ok("Request rejected.");
    }


    @PutMapping("/return/{issueId}")
    public ResponseEntity<String> returnBook(@PathVariable Long issueId) {
        bookIssueService.returnBook(issueId);
        return ResponseEntity.ok("Book returned successfully.");
    }


    @PostMapping("/student/{studentId}/book/{bookId}")
    public ResponseEntity<String> directIssue(@PathVariable Long studentId, @PathVariable Long bookId) {
        try {
            bookIssueService.issueBookDirectly(studentId, bookId);
            return ResponseEntity.ok("Book issued successfully!");
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @PostMapping("/confirm/roll/{rollNo}/book/{bookId}")
    public ResponseEntity<String> issueByRollNo(@PathVariable String rollNo, @PathVariable Long bookId) {
        try {
            bookIssueService.issueBookDirectlyByRollNo(rollNo, bookId);
            return ResponseEntity.ok("Book issued successfully to Roll No: " + rollNo);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }catch (Exception e){
            e.printStackTrace();
            return ResponseEntity.status(500).body("Server Error: " + e.getMessage());
        }
    }


}
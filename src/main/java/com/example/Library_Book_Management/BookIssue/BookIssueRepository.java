package com.example.Library_Book_Management.BookIssue;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookIssueRepository extends JpaRepository<BookIssue, Long> {
    // Check if book is busy
    boolean existsByBookIdAndStatusIn(Long bookId, List<IssueStatus> statuses);

    // Find all pending requests
    List<BookIssue> findAllByStatus(IssueStatus status);

    // Find specific student history
    List<BookIssue> findAllByStudentId(Long studentId);
}
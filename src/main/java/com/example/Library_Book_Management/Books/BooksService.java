package com.example.Library_Book_Management.Books;

import java.util.List;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Library_Book_Management.BookIssue.BookIssueRepository;
import com.example.Library_Book_Management.BookIssue.IssueStatus;

import jakarta.transaction.Transactional;

@Service
public class BooksService {
 private final BooksRepository booksRepository;
 private final BookIssueRepository bookIssueRepository;
 @Autowired
 public BooksService(BooksRepository booksRepository, BookIssueRepository bookIssueRepository){
    this.booksRepository= booksRepository;
    this.bookIssueRepository= bookIssueRepository;
 }

 public List<Books> getBooks(){
    return booksRepository.findAll();
 }

 public void addBooks(Books books){
    Optional<Books> booksOptional=booksRepository.findBooksByBookName(books.getBookName());
    if(booksOptional.isPresent()){
        throw new IllegalStateException("book is already present");
    }
    booksRepository.save(books);
 }

// inside BooksService.java

public void deleteBooks(Long bookId) {
    boolean exist = booksRepository.existsById(bookId);
    if (!exist) {
        throw new IllegalStateException("Book with id " + bookId + " doesnt exist");
    }

    
    boolean isActive = bookIssueRepository.existsByBookIdAndStatusIn(
            bookId, 
            List.of(IssueStatus.REQUESTED, IssueStatus.ISSUED) // Check these statuses
    );

    if (isActive) {
        throw new IllegalStateException("⚠️ Cannot delete. Book is currently Issued or Requested!");
    }

    booksRepository.deleteById(bookId);
}

// search a book
public List <Books> getBooks(String search){
    if( search !=null || !search.isEmpty()){
        return booksRepository.findByBookNameContainingIgnoreCaseOrAuthorContainingIgnoreCase(search, search);
    }
    return booksRepository.findAll();
}
 
@Transactional
public void updateBooks(Long bookId, Books updatedBook) {
    Books existingBook = booksRepository.findById(bookId)
        .orElseThrow(() -> new IllegalStateException("Book not found"));

    if (updatedBook.getBookName() != null) {
        existingBook.setBookName(updatedBook.getBookName());
    }

    if (updatedBook.getAuthor() != null) {
        existingBook.setAuthor(updatedBook.getAuthor());
    }

    booksRepository.save(existingBook);
}

}

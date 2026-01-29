package com.example.Library_Book_Management.Books;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController

@RequestMapping(path= "/book")
public class BooksController {
  private final BooksService booksService;

  @Autowired
  public BooksController(BooksService booksService){
    this.booksService= booksService;
  }
 
  @GetMapping
public List<Books> getBooks(@RequestParam(required = false) String search) {
    return booksService.getBooks(search);
}
  @PostMapping
  public void registerNewBooks(@RequestBody Books books){
    booksService.addBooks(books);
  }

  @DeleteMapping(path="/{bookId}")
  public void deleteBooks(@PathVariable("bookId") Long bookId){
    booksService.deleteBooks(bookId);
  }

 @PutMapping(path = "/{bookId}")
    public void updatebook(@PathVariable("bookId") Long bookId, @RequestBody Books books) {
        booksService.updateBooks(bookId, books);
    }
}

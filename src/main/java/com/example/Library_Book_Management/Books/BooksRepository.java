package com.example.Library_Book_Management.Books;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;

@Repository
public interface BooksRepository extends JpaRepository<Books, Long> {
    Optional<Books> findBooksByBookName(String bookName);
    boolean existsByBookName(String bookName);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select b from Books b where b.id = :id")
    Optional<Books> findByIdForUpdate(@Param("id") Long id);
}

package com.example.Library_Book_Management.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, Long> {

    
    @Query("SELECT u FROM User u WHERE LOWER(TRIM(u.email)) = LOWER(TRIM(:email))")
    Optional<User> findByEmail(@Param("email") String email);
}
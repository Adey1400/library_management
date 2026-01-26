package com.example.Library_Book_Management.Student;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.Library_Book_Management.User.UserRepo;

import jakarta.transaction.Transactional;

@Service
public class StudentService {
  private final StudentRepository studentRepository;
  private final UserRepo userRepo;
  @Autowired
  public StudentService(StudentRepository studentRepository , UserRepo userRepo){
    this.studentRepository= studentRepository;
    this.userRepo = userRepo;
  }
  
  //get all student
public List<Student> getAllStudents(){
    return studentRepository.findAll();
  }


  //add Student
  public Student addStudent(Student student){
     Optional<Student> existingStudent =studentRepository.findByEmail(student.getEmail());
     if(existingStudent.isPresent()){
        throw new IllegalStateException("Student with email"+student.getEmail()+"already exist");
     }
     studentRepository.save(student);
     return student;
  }

   // Delete student by ID
   @Transactional
    public void deleteStudent(Long id) {
      Student student = studentRepository.findById(id).orElseThrow(()-> new IllegalStateException("Student with id " + id + " does not exist"));
      Long userId = student.getUser().getId();
      studentRepository.delete(student);
      if (userId != null) {
            userRepo.deleteById(userId);
        }
    }
        

      // 🔹 (Optional) Get one student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Student with id " + id + " not found"));
    }


}

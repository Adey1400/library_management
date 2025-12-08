package com.example.Library_Book_Management.Student;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {
  private final StudentRepository studentRepository;

  @Autowired
  public StudentService(StudentRepository studentRepository){
    this.studentRepository= studentRepository;
  }
  
  //get all student
public List<Student> getAllStudents(){
    return studentRepository.findAll();
  }


  //add Student
  public void addStudent(Student student){
     Optional<Student> existingStudent =studentRepository.findByEmail(student.getEmail());
     if(existingStudent.isPresent()){
        throw new IllegalStateException("Student with email"+student.getEmail()+"already exist");
     }
     studentRepository.save(student);
  }

   // Delete student by ID
    public void deleteStudent(Long id) {
        boolean exists = studentRepository.existsById(id);
        if (!exists) {
            throw new IllegalStateException("Student with id " + id + " does not exist");
        }
        studentRepository.deleteById(id);
    }

      // 🔹 (Optional) Get one student by ID
    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Student with id " + id + " not found"));
    }


}

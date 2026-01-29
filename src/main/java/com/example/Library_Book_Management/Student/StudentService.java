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
  
public List<Student> getAllStudents(){
    return studentRepository.findAll();
  }


  public Student addStudent(Student student){
     Optional<Student> existingStudent =studentRepository.findByEmail(student.getEmail());
     if(existingStudent.isPresent()){
        throw new IllegalStateException("Student with email"+student.getEmail()+"already exist");
     }
     studentRepository.save(student);
     return student;
  }

   @Transactional
    public void deleteStudent(Long id) {
      Student student = studentRepository.findById(id).orElseThrow(()-> new IllegalStateException("Student with id " + id + " does not exist"));
      Long userId = student.getUser().getId();
      studentRepository.delete(student);
      if (userId != null) {
            userRepo.deleteById(userId);
        }
    }
        

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Student with id " + id + " not found"));
    }



@Transactional
public void updateStudent(Long studentId, Student updatedDetails) {
    Student student = studentRepository.findById(studentId)
            .orElseThrow(() -> new IllegalStateException("Student with id " + studentId + " does not exist"));


    if (updatedDetails.getName() != null && !updatedDetails.getName().isEmpty()) {
        student.setName(updatedDetails.getName());
    }


    if (updatedDetails.getDepartment() != null && !updatedDetails.getDepartment().isEmpty()) {
        student.setDepartment(updatedDetails.getDepartment());
    }


    if (updatedDetails.getCurrentYear() != null && !updatedDetails.getCurrentYear().isEmpty()) {
        student.setCurrentYear(updatedDetails.getCurrentYear());
    }


    if (updatedDetails.getSemester() != null && !updatedDetails.getSemester().isEmpty()) {
        student.setSemester(updatedDetails.getSemester());
    }

    studentRepository.save(student);
}
}

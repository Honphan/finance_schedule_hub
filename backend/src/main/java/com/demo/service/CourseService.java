package com.demo.service;


import com.demo.dto.request.CourseRequest;
import com.demo.dto.response.CourseResponse;
import com.demo.entity.Course;
import com.demo.entity.User;
import com.demo.repository.CourseRepo;
import com.demo.repository.UserRepo;
import jakarta.persistence.EntityManager;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {
    private final CourseRepo courseRepo;
    private final UserRepo userRepo;
    public CourseService(CourseRepo courseRepo, EntityManager entityManager, EntityManager entityManager1, UserRepo userRepo) {
        this.courseRepo = courseRepo;
        this.userRepo = userRepo;
    }

    public ResponseEntity<?> getAllCourses(Integer userId) {
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User không tồn tại!");
        }
            List<CourseResponse> courseList = user.getCourses().stream()
                    .map(course -> CourseResponse.builder()
                            .id(course.getId())
                            .name(course.getName())
                            .credits(course.getCredits())
                            .lecturer(course.getLecturer())
                            .build())
                    .toList();

            return ResponseEntity.ok(courseList);

    }

    public ResponseEntity<?> saveCourse(CourseRequest request, Integer userId) {
        if(courseRepo.findByName(request.getName()) != null) {
            return ResponseEntity.badRequest().body("Course already exists");
        }
        User user = userRepo.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User không tồn tại!");
        }
        Course course = Course.builder()
                .name(request.getName())
                .credits(request.getCredits())
                .lecturer(request.getLecturer())
                .build();

        course.setUser(user);
        courseRepo.save(course);

        user.getCourses().add(course);

        return ResponseEntity.ok("Course saved successfully");
    }
}

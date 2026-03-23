package com.demo.controller;

import com.demo.config.UserPrincipal;
import com.demo.dto.request.CourseRequest;
import com.demo.entity.Course;
import com.demo.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<?> getAllCourses(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return courseService.getAllCourses(userPrincipal.getId());
    }

    @RequestMapping
    public ResponseEntity<?> saveCourse(@RequestBody CourseRequest request,
                                        @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return courseService.saveCourse(request,userPrincipal.getId());
    }
}

package com.demo.service;


import com.demo.dto.request.TimetableRequest;
import com.demo.dto.response.CourseResponse;
import com.demo.dto.response.TimetableResponse;
import com.demo.entity.Course;
import com.demo.entity.Timetable;
import com.demo.entity.User;
import com.demo.repository.CourseRepo;
import com.demo.repository.TimetableRepo;
import com.demo.repository.UserRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimetableService {

    private final TimetableRepo timetableRepo;
    private final UserRepo userRepo;
    private final CourseRepo courseRepo;

    public TimetableService(TimetableRepo timetableRepo, UserRepo userRepo, CourseRepo courseRepo) {
        this.timetableRepo = timetableRepo;
        this.userRepo = userRepo;
        this.courseRepo = courseRepo;
    }

    public ResponseEntity<?> getAllTimetables(Integer userId) {
        try {
            List<TimetableResponse> timetableResponse = timetableRepo.findByUserId(userId).stream()
                    .map( (t) -> TimetableResponse.builder()
                            .room(t.getRoom())
                            .dayOfWeek(t.getDayOfWeek())
                            .period(t.getPeriod())
                            .course(CourseResponse.builder()
                                    .id(t.getCourse().getId())
                                    .name(t.getCourse().getName())
                                    .credits(t.getCourse().getCredits())
                                    .lecturer(t.getCourse().getLecturer())
                                    .build()
                            )
                            .build()).toList();
                return ResponseEntity.ok(timetableResponse);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching timetables: " + e.getMessage());
        }

    }

    public ResponseEntity<?> saveTimetable(TimetableRequest request, Integer userId) {
        User user = userRepo.findById(userId).orElse(null);
        Course course = courseRepo.findById(request.getCourseId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body("User không tồn tại!");
        }
        if (course == null) {
            return ResponseEntity.badRequest().body("Course không tồn tại!");
        }

        Timetable timetable = Timetable.builder()
                .dayOfWeek(request.getDayOfWeek())
                .period(request.getPeriod())
                .room(request.getRoom())
                .course(course)
                .user(user)
                .build();
        timetableRepo.save(timetable);

        return ResponseEntity.ok("Timetable saved successfully");
    }



}

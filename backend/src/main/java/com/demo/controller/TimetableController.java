package com.demo.controller;

import com.demo.config.UserPrincipal;
import com.demo.dto.request.TimetableRequest;
import com.demo.service.TimetableService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/timetables")
public class TimetableController {

    private final TimetableService timetableService;
    public TimetableController(TimetableService timetableService) {
        this.timetableService = timetableService;
    }
    @GetMapping
    public ResponseEntity<?> getAllTimetables(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return timetableService.getAllTimetables(userPrincipal.getId());
    }

    @PostMapping
    public ResponseEntity<?> saveTimetable(@RequestBody TimetableRequest request, @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return timetableService.saveTimetable(request, userPrincipal.getId());
    }

}

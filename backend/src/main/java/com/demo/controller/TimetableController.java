package com.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/timetables")
public class TimetableController {

    @GetMapping
    public ResponseEntity<?> getAllTimetables() {
        System.out.println("Get all timetables");
        return ResponseEntity.ok("Get all timetables");
    }

}

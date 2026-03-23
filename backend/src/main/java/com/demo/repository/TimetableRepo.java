package com.demo.repository;

import com.demo.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TimetableRepo extends JpaRepository<Timetable, Integer> {
     Timetable findByUserId(Integer userId);
}

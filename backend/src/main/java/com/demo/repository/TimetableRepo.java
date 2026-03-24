package com.demo.repository;

import com.demo.entity.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TimetableRepo extends JpaRepository<Timetable, Integer> {
     List<Timetable> findByUserId(Integer userId);
}

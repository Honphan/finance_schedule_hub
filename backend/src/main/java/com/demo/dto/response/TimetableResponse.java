package com.demo.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TimetableResponse {
    private Integer dayOfWeek;
    private Integer period;
    private String room;
    private CourseResponse course;
}

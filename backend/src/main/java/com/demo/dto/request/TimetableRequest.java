package com.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TimetableRequest {
     private Integer dayOfWeek;
     private Integer period;
     private String room;
     private Integer courseId;
}

package com.demo.enums;

import lombok.Getter;

@Getter
public enum Period {
    PERIOD_1(1, "07:00", "09:30"),
    PERIOD_2(2, "09:30", "12:00"),
    PERIOD_3(3, "13:00", "15:30"),
    PERIOD_4(4, "15:30", "18:00");

    private final int value;
    private final String startTime;
    private final String endTime;

    Period(int value, String startTime, String endTime) {
        this.value = value;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

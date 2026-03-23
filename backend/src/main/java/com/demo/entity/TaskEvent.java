package com.demo.entity;

import com.demo.enums.TaskEventStatus;
import com.demo.enums.TaskEventType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks_events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaskEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 150, nullable = false)
    private String title;

    @Column(length = 500)
    private String description;

    @Column
    private LocalDateTime deadline;

    @Column(length = 20, nullable = false)
    private TaskEventStatus status;

    @Column(length = 50, nullable = false)
    private TaskEventType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

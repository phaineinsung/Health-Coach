package com.team.health_coach.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "\"Exercise_records\"")
public class Exercise_Records {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "record_id")
    private Long recordId;

    @ManyToOne
    @JoinColumn(name = "user_num", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "ex_id", nullable = false)
    private Exercise exercise;

    @Column(name = "ex_date", nullable = false)
    private LocalDate exDate;

    @Column(name = "ex_time", nullable = false)
    private int exTime;

    // Getters and Setters
    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public void setExercise(Exercise exercise) {
        this.exercise = exercise;
    }

    public LocalDate getExDate() {
        return exDate;
    }

    public void setExDate(LocalDate exDate) {
        this.exDate = exDate;
    }

    public int getExTime() {
        return exTime;
    }

    public void setExTime(int exTime) {
        this.exTime = exTime;
    }
}

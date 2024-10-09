package com.team.health_coach.dto;

import java.time.LocalDate;

public class Exercise_Records_DTO {

    private Long recordId;
    private Long userNum;
    private Long exId;
    private LocalDate exDate;
    private int exTime;

    // Constructors, Getters, and Setters
    public Exercise_Records_DTO() {
        // Default constructor
    }

    public Exercise_Records_DTO(Long recordId, Long userNum, Long exId, LocalDate exDate, int exTime) {
        this.recordId = recordId;
        this.userNum = userNum;
        this.exId = exId;
        this.exDate = exDate;
        this.exTime = exTime;
    }

    public Long getRecordId() {
        return recordId;
    }

    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public Long getUserNum() {
        return userNum;
    }

    public void setUserNum(Long userNum) {
        this.userNum = userNum;
    }

    public Long getExId() {
        return exId;
    }

    public void setExId(Long exId) {
        this.exId = exId;
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

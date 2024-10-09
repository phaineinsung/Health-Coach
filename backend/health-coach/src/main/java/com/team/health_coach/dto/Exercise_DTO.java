package com.team.health_coach.dto;

public class Exercise_DTO {

    private Long ex_id;
    private String ex_name;

    public Exercise_DTO() {
    }

    public Exercise_DTO(Long ex_id, String ex_name) {
        this.ex_id = ex_id;
        this.ex_name = ex_name;
    }

    public Long getExId() {
        return ex_id;
    }

    public void setExId(Long ex_id) {
        this.ex_id = ex_id;
    }

    public String getExName() {
        return ex_name;
    }

    public void setExName(String ex_name) {
        this.ex_name = ex_name;
    }
}

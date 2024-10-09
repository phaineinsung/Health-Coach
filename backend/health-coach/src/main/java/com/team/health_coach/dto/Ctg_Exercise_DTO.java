package com.team.health_coach.dto;

public class Ctg_Exercise_DTO {
    private Long ctg_id;
    private String ctg_name;

    public Ctg_Exercise_DTO() {}

    public Ctg_Exercise_DTO(Long ctg_id, String ctg_name) {
        this.ctg_id = ctg_id;
        this.ctg_name = ctg_name;
    }

    public Long getCtg_id() {
        return ctg_id;
    }

    public void setCtg_id(Long ctg_id) {
        this.ctg_id = ctg_id;
    }

    public String getCtg_name() {
        return ctg_name;
    }

    public void setCtg_name(String ctg_name) {
        this.ctg_name = ctg_name;
    }
}

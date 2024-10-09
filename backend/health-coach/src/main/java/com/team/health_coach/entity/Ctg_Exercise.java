package com.team.health_coach.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Ctg_Exercise")
public class Ctg_Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ctg_id")
    private Long ctg_id;

    @Column(name = "ctg_name", nullable = false)
    private String ctg_name;

    // Getters and Setters
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

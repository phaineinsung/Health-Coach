package com.team.health_coach.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "\"Exercise\"")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ex_id;

    @ManyToOne
    @JoinColumn(name = "ctg_id")
    private Ctg_Exercise category;

    @Column(unique = true)
    private String ex_name;

    // Getters and Setters
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

    public Ctg_Exercise getCategory() {
        return category;
    }

    public void setCategory(Ctg_Exercise category) {
        this.category = category;
    }
}

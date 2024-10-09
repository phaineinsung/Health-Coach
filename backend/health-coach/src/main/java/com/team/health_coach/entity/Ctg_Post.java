package com.team.health_coach.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "\"Ctg_Post\"") // 테이블 이름을 'Ctg_Post'로 설정
public class Ctg_Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ctg_id")
    private Long ctgId;

    @Column(name = "ctg_name", unique = true)
    private String ctgName;

    @OneToMany(mappedBy = "ctgPost")
    private List<Post> posts;

    // Getters and Setters
    public Long getCtgId() {
        return ctgId;
    }

    public void setCtgId(Long ctgId) {
        this.ctgId = ctgId;
    }

    public String getCtgName() {
        return ctgName;
    }

    public void setCtgName(String ctgName) {
        this.ctgName = ctgName;
    }

    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }
}

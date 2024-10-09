package com.team.health_coach.entity;

import jakarta.persistence.*;

@Entity
//@Table(name = "Star")
@Table(name = "Star", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_num", "star_id"})
})
public class Star {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "star_id")
    private Long starId;

    // User 엔티티와의 외래 키 관계
    @ManyToOne
    @JoinColumn(name = "user_num")
    private User user;
    
    // Post 엔티티와의 외래 키 관계
    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;

    // Getters and Setters
    public Long getStarId() {
        return starId;
    }

    public void setStarId(Long starId) {
        this.starId = starId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }
}

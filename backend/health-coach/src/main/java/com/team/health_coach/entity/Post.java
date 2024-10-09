package com.team.health_coach.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "\"Post\"") // 테이블 이름을 Post로 설정
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @ManyToOne
    @JoinColumn(name = "user_num")
    private User user;

    @ManyToOne
    @JoinColumn(name = "ctg_id")
    private Ctg_Post ctgPost;

    private String content;
    private String title;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    private String image;

    // 엔티티가 생성될 때 현재 시간을 uploadDate에 설정
    @PrePersist
    protected void onCreate() {
        uploadDate = LocalDateTime.now();
    }
}

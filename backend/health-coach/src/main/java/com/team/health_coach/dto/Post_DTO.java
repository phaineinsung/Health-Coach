package com.team.health_coach.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class Post_DTO {
    private Long postId;
    private Long userNum;
    private Long ctgId;
    private String content;
    private String title;
    private LocalDateTime uploadDate;
    private String image;

    public Post_DTO(Long postId, Long userNum, Long ctgId, String content, String title, LocalDateTime uploadDate, String image) {
        this.postId = postId;
        this.userNum = userNum;
        this.ctgId = ctgId;
        this.content = content;
        this.title = title;
        this.uploadDate = uploadDate;
        this.image = image;
    }
}

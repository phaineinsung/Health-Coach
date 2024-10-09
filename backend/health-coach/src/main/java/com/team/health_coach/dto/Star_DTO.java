package com.team.health_coach.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Star_DTO {
    private Long star_id;
    private Long user_num;
    private Long post_id;

    public Star_DTO(Long star_id, Long user_num, Long post_id) {
        this.star_id = star_id;
        this.user_num = user_num;
        this.post_id = post_id;
    }
}

package com.team.health_coach.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Ctg_Post_DTO {
    private Long ctgId;
    private String ctgName;

    public Ctg_Post_DTO(Long ctgId, String ctgName) {
        this.ctgId = ctgId;
        this.ctgName = ctgName;
    }
}

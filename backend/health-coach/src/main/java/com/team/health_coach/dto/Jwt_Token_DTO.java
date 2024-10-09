package com.team.health_coach.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class Jwt_Token_DTO {
    private String grantType;
    private String accessToken;
    private String refreshToken;
}
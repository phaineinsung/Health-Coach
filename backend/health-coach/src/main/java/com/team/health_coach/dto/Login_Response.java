package com.team.health_coach.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
// 로그인 응답 객체 ( Jwt 토큰 정보 + 사용자 정보 )
public class Login_Response {
    private Jwt_Token_DTO token;
    private User_DTO user;
}

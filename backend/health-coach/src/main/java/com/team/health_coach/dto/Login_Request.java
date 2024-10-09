package com.team.health_coach.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Login_Request {
    private String email; // username을 email로 변경
    private String pw; // password를 pw로 변경
}

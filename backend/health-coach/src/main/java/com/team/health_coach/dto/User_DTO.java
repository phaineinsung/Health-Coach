package com.team.health_coach.dto;

import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
//@NoArgsConstructor(access = AccessLevel.PROTECTED)
@NoArgsConstructor
public class User_DTO {
    private Long user_num;
    private String email;
    private String name;
    private String pw;
    //private List<String> roles;

    public User_DTO(Long user_num, String email, String name, String pw) {
        this.user_num = user_num;
        this.email = email;
        this.name = name;
        this.pw = pw;
    }
}

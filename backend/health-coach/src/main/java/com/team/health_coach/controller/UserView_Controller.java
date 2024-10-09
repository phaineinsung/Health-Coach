package com.team.health_coach.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

// 사용자에게 화면을 보여주기 위한 컨트롤러
@Controller
public class UserView_Controller {

    // 회원가입 페이지로 이동
    @GetMapping("/public/signup")
    public String showSignupForm() {
        return "signup"; // signup.html을 반환
    }

    //로그인 페이지 이동
    @GetMapping("/public/login")
    public String login(){
        return "login";
    }

}

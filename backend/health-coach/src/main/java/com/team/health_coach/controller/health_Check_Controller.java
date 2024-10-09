package com.team.health_coach.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class health_Check_Controller {
    @GetMapping
    public String checkHealth() {
        // 헬스 체크 응답
        return "Healthy";
    }
}

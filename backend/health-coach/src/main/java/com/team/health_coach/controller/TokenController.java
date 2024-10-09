package com.team.health_coach.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team.health_coach.service.TokenService;


@RestController
@RequestMapping("/api/")
public class TokenController {
    private final TokenService tokenService;

    public TokenController(TokenService tokenService){
        this.tokenService = tokenService;
    }

    @GetMapping("token")
    public String getToken() {
        return tokenService.requestToken();
    }
}

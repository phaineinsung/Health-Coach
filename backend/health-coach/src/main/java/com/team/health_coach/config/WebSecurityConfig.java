package com.team.health_coach.config;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.team.health_coach.Jwt.Jwt_Authentication_Filter;
import com.team.health_coach.Jwt.Jwt_Token_Provider;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {

    //private final UserDetail_Service userService;
    private final UserDetailsService userDetailsService;
    private final Jwt_Token_Provider jwtTokenProvider;;

    // 전체 허용 (회원, 비회원 모두 접속 가능)
    String[] publicPaths = {
            "/home",
            "/users/login",
            "/users/signup",
            "/users/refresh"
    };

    // GET 요청 허용
    String[] publicGetPaths = {
            "/posts/**", "/ctg_post/**",  "/health"
    };

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CORS 설정
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // CSRF 보호 비활성화
                .csrf().disable()
                // 세션 관리 정책을 STATELESS로 설정
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests(authz -> authz

                        // 로그인, 사용자, 공개 엔드포인트에 대한 접근 허용
                        .requestMatchers(publicPaths).permitAll()
                        .requestMatchers(HttpMethod.GET, publicGetPaths).permitAll()
                        // 그 외 모든 요청은 인증 필요
                        .anyRequest().authenticated()
                )

                // JWT 인증필터
                .addFilterBefore(new Jwt_Authentication_Filter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                // 사용자 세부 서비스와 패스워드 인코더 설정
                //.userDetailsService(userService)
                .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 허용할 출처 설정
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:80", // ⭐ 로컬 HTTP로부터 들어오는 ORIGIN 허용
                "http://localhost:8080", //⭐ 로컬 WAS로부터 들어오는 ORIGIN 허용
                "http://localhost:3000", //⭐ 로컬 리액트서버로부터 들어오는 ORIGIN 허용
                "https://rlabvoosh.toastcdn.net", // ⭐ S3 호스트 ORIGIN 서버
                "localhost:8080", "localhost:80" // ⭐ EC2 자기 자신 리다이렉션?
        ));
        // 허용할 HTTP 메서드 설정
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        // 허용할 헤더 설정
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type", "Refresh-Token"));
        // 노출할 헤더 설정
        configuration.setExposedHeaders(Arrays.asList("Access-Token", "Authorization"));
        // 자격 증명 허용
        configuration.setAllowCredentials(true);


        // CORS 설정 소스 등록
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}

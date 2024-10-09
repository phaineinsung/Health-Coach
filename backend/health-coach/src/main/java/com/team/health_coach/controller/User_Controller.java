package com.team.health_coach.controller;

import com.team.health_coach.dto.Jwt_Token_DTO;
import com.team.health_coach.dto.Login_Request;
import com.team.health_coach.dto.Login_Response;
import com.team.health_coach.dto.User_DTO;

import com.team.health_coach.entity.User;
import com.team.health_coach.service.User_Service;
import com.team.health_coach.Jwt.Jwt_Token_Provider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:3000", exposedHeaders = "Authorization")
@RequestMapping("/users")
public class User_Controller {

    private final AuthenticationManager authenticationManager;
    private final Jwt_Token_Provider jwtTokenProvider;
    private final User_Service userService;

    // 로그인 + Jwt token 생성
    @PostMapping("/login")
    public ResponseEntity<Login_Response> login(@RequestBody Login_Request loginRequest, HttpServletResponse response) {
        // 받은 객체 정보를 기반으로 인증 객체 생성
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPw()));

        // Jwt 토큰 생성
        Jwt_Token_DTO jwtToken = jwtTokenProvider.generateToken(authentication);

        // Authorization 헤더에 액세스 토큰 추가
        response.addHeader("Authorization", "Bearer " + jwtToken.getAccessToken());
        response.addHeader("Refresh-Token", "Bearer " + jwtToken.getRefreshToken());

        // 사용자 정보 가져오기
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 사용자 정보를 DTO에 설정, 비밀번호는 null로 설정한 후
        // Login_Response DTO에 토큰 정보와 함께 Setting
        Login_Response loginResponse = new Login_Response(jwtToken, new User_DTO(user.getUserNum(), user.getEmail(), user.getName(), null));

        return ResponseEntity.ok(loginResponse);
    }


    // Refresh Token을 검증하고 새로운 Access Token 발급
    @PostMapping("/refresh")
    public ResponseEntity<Jwt_Token_DTO> refresh(HttpServletRequest request) {
        try {
            //String refreshToken = request.getHeader("Authorization").substring(7); // Bearer 이후 토큰 값만 추출

            String refreshToken = request.getHeader("Refresh-Token");
            String previousAccessToken = request.getHeader("Authorization").substring(7);;

            if (refreshToken == null || refreshToken.trim().isEmpty()) {
                log.warn("리프레시 토큰이 헤더에 포함되지 않았습니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // 리프레시 토큰이 없는 경우
            }

            if (previousAccessToken == null || previousAccessToken.trim().isEmpty()) {
                log.warn("이전 액세스 토큰이 헤더에 포함되지 않았습니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null); // 이전 액세스 토큰이 없는 경우
            }

            log.info("리프레시 토큰 갱신 요청: {}", refreshToken);

            // 리프레시 토큰이 유효한지 확인
            boolean isRefreshTokenValid = jwtTokenProvider.validateToken(refreshToken);

            // 유효하지 않은 경우 처리
            if (!isRefreshTokenValid) {

                    log.warn("리프레시 토큰이 유효하지 않음: {}", refreshToken);

                    // 리프레시 토큰이 만료된 경우, 401 Unauthorized 반환 : 로그아웃
                    if (jwtTokenProvider.isTokenExpired(refreshToken)) {
                        log.info("리프레시 토큰이 만료되었습니다. 로그아웃 처리 필요.");
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
                    } else {
                        log.info("리프레시 토큰이 유효하지 않으나 만료되지 않음. 접근 거부.");
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(null);
                    }
                }
            // 리프레시 토큰이 유효한 경우, 새 액세스 토큰만 발급
            else {
            Jwt_Token_DTO newAccessToken = jwtTokenProvider.generateNewAccessToken(refreshToken, previousAccessToken);
            // 새 액세스 토큰을 헤더에 추가
                return ResponseEntity.ok()
                        .header("Authorization", "Bearer " + newAccessToken.getAccessToken())
                        .body(newAccessToken);
            }
        } catch (Exception e) {
            log.error("토큰 갱신 실패", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 회원가입 처리
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User_DTO userDTO) {
        userService.save(userDTO);
        return ResponseEntity.ok("User registered successfully");
    }

    // 로그아웃 처리
    @GetMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        new SecurityContextLogoutHandler().logout(request, response, SecurityContextHolder.getContext().getAuthentication());
        return ResponseEntity.ok().build();
    }

    // 전체 사용자 조회
    @GetMapping
    public ResponseEntity<List<User_DTO>> getAllUsers() {
        List<User_DTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // 특정 사용자 조회
    @GetMapping("/{user_num}")
    public ResponseEntity<User_DTO> getUserById(@PathVariable Long user_num) {
        return userService.getUserById(user_num)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // 사용자 정보 수정
    @PutMapping("/{user_num}")
    public ResponseEntity<User_DTO> updateUser(@PathVariable Long user_num, @RequestBody User_DTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(user_num, userDTO));
    }

    // 사용자 정보 삭제
    @DeleteMapping("/{user_num}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long user_num) {
        userService.deleteUser(user_num);
        return ResponseEntity.ok().build();
    }
}

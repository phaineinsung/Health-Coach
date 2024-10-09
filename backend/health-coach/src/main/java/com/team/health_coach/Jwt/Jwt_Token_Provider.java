package com.team.health_coach.Jwt;

import com.team.health_coach.dto.Jwt_Token_DTO;
import com.team.health_coach.service.User_Service;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Component
public class Jwt_Token_Provider {
    private final Key key;
    //private final User_Service userService;
    private final UserDetailsService userDetailsService;

    // application.properties에서 secret 값 가져와서 key에 저장
    public Jwt_Token_Provider(@Value("${jwt.secret}") String secretKey, UserDetailsService userDetailsService) {
        //this.userService = userService;
        this.userDetailsService = userDetailsService;
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
    }

    // Member 정보를 가지고 AccessToken, RefreshToken을 생성하는 메서드
    public Jwt_Token_DTO generateToken(Authentication authentication) {
        // 권한 가져오기
        String authorities = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        if (authorities.isEmpty()) {
            throw new RuntimeException("사용자 권한 정보가 없습니다.");
        }

        long now = (new Date()).getTime();

        // Access Token 생성
        //Date accessTokenExpiresIn = new Date(now + 86400000); // 1일 후 만료
        Date accessTokenExpiresIn = new Date(now + 120000);  // 2분 후 만료
        //Date accessTokenExpiresIn = new Date(now + 30000); // 30초 (TEST)
        String accessToken = Jwts.builder()
                .setSubject(authentication.getName()) // 유저 식별 정보 (일반적으로 email)
                .claim("auth", authorities)
                .setExpiration(accessTokenExpiresIn)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        // Refresh Token 생성
        String refreshToken = Jwts.builder()
                .setSubject(authentication.getName()) // 유저 식별 정보
                //.setExpiration(new Date(now + 172800000)) // 2일 후 만료
                .setExpiration(new Date(now + 300000))  // 5분 후 만료
                //.setExpiration(new Date(now + 60000))   // 2분 후 만료 (TEST)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();

        return Jwt_Token_DTO.builder()
                .grantType("Bearer")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    // Refresh Token을 통해 새로운 Access Token 생성 (리프레시 토큰은 갱신하지 않음)
    public Jwt_Token_DTO generateNewAccessToken(String refreshToken, String previousAccessToken) {
        // 리프레시 토큰 검증
        Claims refreshTokenClaims = parseClaims(refreshToken);

        if (refreshTokenClaims.getSubject() == null) {
            throw new RuntimeException("Refresh Token에 사용자 정보가 없습니다.");
        }

        // 이전 액세스 토큰에서 권한 정보 추출
        Claims accessTokenClaims = parseClaims(previousAccessToken);

        String authorities = accessTokenClaims.get("auth", String.class);
        if (authorities == null || authorities.isEmpty()) {
            throw new RuntimeException("이전 Access Token에 권한 정보가 없습니다.");
        }

        long now = (new Date()).getTime();
        Date accessTokenExpiresIn = new Date(now + 120000);  // 2분 후 만료
        //Date accessTokenExpiresIn = new Date(now + 30000); // 30초 (TEST)

        // 새로운 액세스 토큰 생성
        String newAccessToken = Jwts.builder()
                .setSubject(refreshTokenClaims.getSubject())  // 사용자 정보 설정
                .claim("auth", authorities)              // 이전 액세스 토큰에서 가져온 권한 정보 설정
                .setExpiration(accessTokenExpiresIn)          // 만료 시간 설정
                .signWith(key, SignatureAlgorithm.HS256)      // 서명 설정
                .compact();

        // 새로운 액세스 토큰만 반환하고, 리프레시 토큰은 그대로 유지
        return Jwt_Token_DTO.builder()
                .grantType("Bearer")
                .accessToken(newAccessToken)
                .refreshToken(refreshToken) // 기존 리프레시 토큰 그대로 반환
                .build();
    }

    // Jwt 토큰을 복호화하여 토큰에 들어있는 정보를 꺼내는 메서드
    public Authentication getAuthentication(String accessToken) {
        // Jwt 토큰 복호화
        Claims claims = parseClaims(accessToken);

        if (claims.get("auth") == null || claims.get("auth").toString().trim().isEmpty()) {
            throw new RuntimeException("권한 정보가 없는 토큰입니다.");
        }

        // 클레임에서 권한 정보 가져오기
        Collection<? extends GrantedAuthority> authorities = Arrays.stream(claims.get("auth").toString().split(","))
                .filter(auth -> !auth.trim().isEmpty()) // 빈 문자열 제외
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());

        // UserDetails 객체를 만들어서 Authentication return
        UserDetails principal = new User(claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }


    // 토큰 정보를 검증하는 메서드
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            // 정상적인 토큰은 true 반환
            return true;
        } catch (ExpiredJwtException e) {
            log.warn("만료된 JWT 토큰", e);
        } catch (SecurityException | MalformedJwtException e) {
            log.error("잘못된 JWT 토큰", e);
        } catch (UnsupportedJwtException e) {
            log.error("지원하지 않는 JWT 토큰", e);
        } catch (IllegalArgumentException e) {
            log.error("JWT 클레임이 비어 있습니다.", e);
        }
        return false; // 그 외의 예외 상황에는 false 반환

    }

    // accessToken 복호화
    private Claims parseClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }

    // Token이 만료되었는지 확인하는 메서드
    public boolean isTokenExpired(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            return claims.getExpiration().before(new Date());

        } catch (ExpiredJwtException e) {
            return true; // 만료된 경우
        }
    }

}

package com.team.health_coach.Jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Enumeration;

@RequiredArgsConstructor
public class Jwt_Authentication_Filter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(Jwt_Authentication_Filter.class);
    private final Jwt_Token_Provider jwtTokenProvider;

    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 요청 URI 확인
        String requestURI = request.getRequestURI();
        logger.info("요청 URI: {}", requestURI);

        // /refresh 요청은 Authorization 헤더를 요구하지 않음
        if ("/users/refresh".equals(requestURI)) {
            logger.info("/refresh 요청은 JWT 인증을 건너뜁니다.");
            filterChain.doFilter(request, response);
            return;
        } else {

            // 다른 요청의 경우 JWT 인증 처리
            Enumeration<String> headerNames = request.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                logger.info("Request Header - {}: {}", headerName, request.getHeader(headerName));
            }

            String token = resolveToken(request);
            logger.info("추출된 토큰: {}", token);

            try {
                if (token != null && jwtTokenProvider.validateToken(token)) {
                    Authentication authentication = jwtTokenProvider.getAuthentication(token);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                    logger.info("사용자 인증 설정 완료: {}", authentication.getName());
                } else {
                    logger.warn("유효하지 않은 JWT 토큰");
                }
            } catch (Exception e) {
                logger.error("보안 컨텍스트에 사용자 인증을 설정할 수 없습니다.", e);
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "유효하지 않은 JWT 토큰");
                return;
            }

            filterChain.doFilter(request, response);
        }
    }


    // Request Header(Authorization)에서 토큰 정보 추출
    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        // Authorization 헤더가 없는 경우 로그 추가
        if (bearerToken == null) {
            logger.warn("Authorization 헤더가 요청에 포함되어 있지 않습니다.");
        } else {
            logger.info("Authorization 헤더 값: {}", bearerToken);
        }

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        } else if (StringUtils.hasText(bearerToken)) {
            logger.warn("Bearer 형식이 아닌 Authorization 헤더: {}", bearerToken);
        }

        return null;
    }

}

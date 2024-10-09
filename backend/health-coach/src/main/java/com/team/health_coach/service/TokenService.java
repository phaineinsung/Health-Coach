package com.team.health_coach.service;

import org.springframework.beans.factory.annotation.Value;
import org.json.JSONObject;
// import org.h2.util.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import lombok.Data;

@Service
public class TokenService {

    @Value("${auth.url}")
    private String authUrl;

    @Value("${auth.tenantId}")
    private String tenantId;

    @Value("${auth.username}")
    private String username;

    @Value("${auth.password}")
    private String password;

    private final RestTemplate restTemplate = new RestTemplate();

    //토큰 만료 되었는지 확인
    // private String cachedToken;
    // private OffsetDateTime tokenExpiry;

    // public String getToken() {
    //     if (isTokenExpired()) {
    //         requestToken();
    //     }
    //     return cachedToken;
    // }

    // private boolean isTokenExpired() {
    //     return cachedToken == null || tokenExpiry == null || OffsetDateTime.now().isAfter(tokenExpiry);
    // }

    // 토큰 발급

    public String requestToken() {
        String identityUrl = this.authUrl;

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");

        TokenRequest tokenRequest = new TokenRequest();
        tokenRequest.getAuth().setTenantId(this.tenantId);
        tokenRequest.getAuth().getPasswordCredentials().setUsername(this.username);
        tokenRequest.getAuth().getPasswordCredentials().setPassword(this.password);

        HttpEntity<TokenRequest> httpEntity = new HttpEntity<>(tokenRequest, headers);

        ResponseEntity<String> response = this.restTemplate.exchange(identityUrl, HttpMethod.POST, httpEntity, String.class);

        try {
            // JSON 응답을 JSONObject로 파싱
            JSONObject jsonResponse = new JSONObject(response.getBody());
            // 필요한 id 값 추출
            return jsonResponse.getJSONObject("access")
                    .getJSONObject("token")
                    .getString("id");
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse token response", e);
        }
    }

    @Data
    public static class TokenRequest {
        private Auth auth = new Auth();

        @Data
        public static class Auth {
            private String tenantId;
            private PasswordCredentials passwordCredentials = new PasswordCredentials();
        }

        @Data
        public static class PasswordCredentials {
            private String username;
            private String password;
        }
    }
}
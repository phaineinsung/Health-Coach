package com.team.health_coach.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.team.health_coach.service.TokenService;
// 업로드를 위한 발버둥
@RestController
@RequestMapping("/api/")
public class FileUploadController {

    @Autowired
    private TokenService tokenService;

    @Value("${object.storage.url}")
    private String objectStorageUrl;

    @Value("${cdn.url}")
    private String cdnUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String authToken = tokenService.requestToken(); // 인증 토큰을 얻는 로직 추가


        // object storage의 엔드포인트 경로
        String url = objectStorageUrl + file.getOriginalFilename();
        String tempFilename = cdnUrl + file.getOriginalFilename();

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-Auth-Token", authToken);
        headers.set("Content-Type", file.getContentType());

        HttpEntity<byte[]> requestEntity;
        try {
            requestEntity = new HttpEntity<>(file.getBytes(), headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.PUT, requestEntity, String.class);

            if (response.getStatusCode() == HttpStatus.CREATED || response.getStatusCode() == HttpStatus.OK) {
                Map<String, String> responseBody = new HashMap<>();
                responseBody.put("url", tempFilename);
                return ResponseEntity.ok(responseBody);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}

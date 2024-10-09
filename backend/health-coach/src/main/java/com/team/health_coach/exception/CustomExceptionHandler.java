package com.team.health_coach.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class CustomExceptionHandler {

    // RuntimeException 발생 시 처리
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("code", "USER_NOT_FOUND");
        errorResponse.put("message", ex.getMessage());
        errorResponse.put("details", "Please ensure the user ID is correct and try again.");
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
}

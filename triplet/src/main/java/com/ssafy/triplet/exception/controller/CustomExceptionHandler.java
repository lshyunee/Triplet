package com.ssafy.triplet.exception.controller;

import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<?> handleCustomException(CustomException e) {
        log.info("[handleCustomException] = {}", e.getMessage());
        String message = e.getMessage();
        String errorCode = e.getErrorCode();
        return ResponseEntity
                .status(e.getStatus())
                .body(new ApiResponse<Void>(errorCode, message));
    }

}

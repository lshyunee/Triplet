package com.ssafy.triplet.validation;

import com.ssafy.triplet.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import java.util.HashMap;
import java.util.Map;

@Component
public class CustomValidator {

    // 필드 유효성검사 실패응답 반환
    public ResponseEntity<?> validateField(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> fieldErrors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                fieldErrors.put(error.getField(), error.getDefaultMessage());
            }
            return ResponseEntity.badRequest().body(new ApiResponse<>("400", "유효성 검사 실패", fieldErrors));
        }
        return null;
    }

}

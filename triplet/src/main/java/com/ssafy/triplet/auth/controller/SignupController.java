package com.ssafy.triplet.auth.controller;

import com.ssafy.triplet.member.dto.request.SignupRequest;
import com.ssafy.triplet.member.service.MemberService;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.response.CustomErrorCode;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SignupController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignupRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return handleFieldErrors(bindingResult);
        }
        ApiResponse<?> response = memberService.singUp(request);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    // 회원가입 필드별 유효성검사 실패응답
    private ResponseEntity<?> handleFieldErrors(BindingResult bindingResult) {
        List<FieldError> fieldErrors = bindingResult.getFieldErrors();
        ResponseEntity<?> response = null;
        
        for (FieldError error : fieldErrors) {
            String fieldName = error.getField();

            switch (fieldName) {
                case "memberId" ->
                        response = new ResponseEntity<>(ApiResponse.isError(CustomErrorCode.INVALID_ID), HttpStatus.BAD_REQUEST);
                case "password" ->
                        response = new ResponseEntity<>(ApiResponse.isError(CustomErrorCode.INVALID_PASSWORD), HttpStatus.BAD_REQUEST);
                case "phoneNumber" ->
                        response = new ResponseEntity<>(ApiResponse.isError(CustomErrorCode.INVALID_PHONE_NUMBER), HttpStatus.BAD_REQUEST);
                case "name" ->
                        response = new ResponseEntity<>(ApiResponse.isError(CustomErrorCode.EMPTY_NAME), HttpStatus.BAD_REQUEST);
                case "identificationNumber" ->
                        response = new ResponseEntity<>(ApiResponse.isError(CustomErrorCode.INVALID_IDENTIFICATION_NUMBER), HttpStatus.BAD_REQUEST);
                default ->
                        response = new ResponseEntity<>(ApiResponse.isError(CustomErrorCode.INVALID_SIMPLE_PASSWORD), HttpStatus.BAD_REQUEST);
            };
        }
        return response;
    }

}

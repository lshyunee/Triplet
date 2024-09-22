package com.ssafy.triplet.auth.controller;

import com.ssafy.triplet.auth.dto.CustomUserPrincipal;
import com.ssafy.triplet.member.dto.request.MemberIdRequest;
import com.ssafy.triplet.member.dto.request.SignupRequest;
import com.ssafy.triplet.member.dto.request.SimplePasswordConfirmRequest;
import com.ssafy.triplet.member.dto.request.SimplePasswordRequest;
import com.ssafy.triplet.member.dto.response.MemberIdResponse;
import com.ssafy.triplet.member.service.MemberService;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.response.CustomErrorCode;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SignupController {

    private final MemberService memberService;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignupRequest request, BindingResult bindingResult, HttpServletResponse response) {
        if (bindingResult.hasErrors()) {
            return handleFieldErrors(bindingResult);
        }
        ApiResponse<?> apiResponse = memberService.singUp(request, response);

        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/simple-password")
    public ResponseEntity<?> simplePassword(@Valid @RequestBody SimplePasswordRequest request, BindingResult bindingResult,
                                            @AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        if (bindingResult.hasErrors()) {
            return handleFieldErrors(bindingResult);
        }
        if (!memberService.createSimplePassword(request, customUserPrincipal.getMemberId())) {
            return new ResponseEntity<>(ApiResponse.isError(CustomErrorCode.SIMPLE_PASSWORD_MISMATCH), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new ApiResponse<Void>("200", "간편비밀번호 설정 성공"), HttpStatus.OK);
    }

    @PostMapping("/simple-password-confirm")
    public ResponseEntity<?> simplePasswordConfirm(@Valid @RequestBody SimplePasswordConfirmRequest request, BindingResult bindingResult,
                                                   @AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        if (bindingResult.hasErrors()) {
            return handleFieldErrors(bindingResult);
        }
        if (!memberService.confirmSimplePassword(request, customUserPrincipal.getMemberId())) {
            return new ResponseEntity<>(ApiResponse.isError(CustomErrorCode.SIMPLE_PASSWORD_MISMATCH), HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(new ApiResponse<Void>("200", "간편비밀번호 인증 성공"), HttpStatus.OK);
    }

    @PostMapping("/signup/is-duplicated")
    public ResponseEntity<?> isDuplicated(@Valid @RequestBody MemberIdRequest request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return handleFieldErrors(bindingResult);
        }
        boolean isDuplicated = memberService.isDuplicated(request);
        MemberIdResponse memberIdResponse = new MemberIdResponse(isDuplicated);
        return new ResponseEntity<>(new ApiResponse<>("200", "아이디 중복확인 성공", memberIdResponse), HttpStatus.OK);
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
                case "newSimplePassword" ->
                        response = new ResponseEntity<>(ApiResponse.isError(CustomErrorCode.INVALID_SIMPLE_PASSWORD), HttpStatus.BAD_REQUEST);
                default ->
                        response = new ResponseEntity<>(ApiResponse.isError(CustomErrorCode.INVALID_IDENTIFICATION_NUMBER), HttpStatus.BAD_REQUEST);
            };
        }
        return response;
    }

}

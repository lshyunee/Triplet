package com.ssafy.triplet.auth.controller;

import com.ssafy.triplet.auth.dto.CustomUserPrincipal;
import com.ssafy.triplet.member.dto.request.MemberIdRequest;
import com.ssafy.triplet.member.dto.request.SignupRequest;
import com.ssafy.triplet.member.dto.request.SimplePasswordConfirmRequest;
import com.ssafy.triplet.member.dto.request.SimplePasswordRequest;
import com.ssafy.triplet.member.dto.response.MemberIdResponse;
import com.ssafy.triplet.member.service.MemberService;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.validation.CustomValidator;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class SignupController {

    private final MemberService memberService;
    private final CustomValidator customValidator;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignupRequest request, BindingResult bindingResult, HttpServletResponse response) {
        ResponseEntity<?> errorResponse = customValidator.validateField(bindingResult);
        if (errorResponse != null) return errorResponse;

        memberService.signUp(request, response);
        return ResponseEntity.ok().body(new ApiResponse<>("200", "회원가입 성공"));
    }

    @PostMapping("/signup/is-duplicated")
    public ResponseEntity<?> isDuplicated(@Valid @RequestBody MemberIdRequest request, BindingResult bindingResult) {
        ResponseEntity<?> errorResponse = customValidator.validateField(bindingResult);
        if (errorResponse != null) return errorResponse;

        boolean isDuplicated = memberService.isDuplicated(request);
        MemberIdResponse memberIdResponse = new MemberIdResponse(isDuplicated);
        return ResponseEntity.ok().body(new ApiResponse<>("200", "아이디 중복확인 성공", memberIdResponse));
    }

    @PostMapping("/simple-password")
    public ResponseEntity<?> simplePassword(@Valid @RequestBody SimplePasswordRequest request, BindingResult bindingResult,
                                            @AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        ResponseEntity<?> errorResponse = customValidator.validateField(bindingResult);
        if (errorResponse != null) return errorResponse;
        memberService.createSimplePassword(request, customUserPrincipal.getMemberId());
        return ResponseEntity.ok().body(new ApiResponse<Void>("200", "간편비밀번호 설정 성공"));
    }

    @PostMapping("/simple-password-confirm")
    public ResponseEntity<?> simplePasswordConfirm(@Valid @RequestBody SimplePasswordConfirmRequest request, BindingResult bindingResult,
                                                   @AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        ResponseEntity<?> errorResponse = customValidator.validateField(bindingResult);
        if (errorResponse != null) return errorResponse;

        if (!memberService.confirmSimplePassword(request, customUserPrincipal.getMemberId())) {
            return ResponseEntity.badRequest().body(ApiResponse.isError(CustomErrorCode.SIMPLE_PASSWORD_MISMATCH));
        }
        return ResponseEntity.ok().body(new ApiResponse<Void>("200", "간편비밀번호 인증 성공"));
    }

}

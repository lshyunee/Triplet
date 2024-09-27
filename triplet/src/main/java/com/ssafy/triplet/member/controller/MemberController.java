package com.ssafy.triplet.member.controller;

import com.ssafy.triplet.auth.dto.CustomUserPrincipal;
import com.ssafy.triplet.member.dto.request.MemberUpdateRequest;
import com.ssafy.triplet.member.dto.request.PasswordUpdateRequest;
import com.ssafy.triplet.member.dto.response.MemberResponse;
import com.ssafy.triplet.member.service.MemberService;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.validation.CustomValidator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final CustomValidator customValidator;

    @GetMapping("/my")
    public ResponseEntity<?> findMyInfo(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        MemberResponse myInfo = memberService.findMyInfo(customUserPrincipal.getMemberId());
        return ResponseEntity.ok().body(new ApiResponse<>("200", "내 정보 조회 성공", myInfo));
    }

    @PutMapping("/my")
    public ResponseEntity<?> updateMyInfo(@Valid @RequestBody MemberUpdateRequest request, BindingResult bindingResult,
                                          @AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        ResponseEntity<?> errorResponse = customValidator.validateField(bindingResult);
        if (errorResponse != null) return errorResponse;

        MemberResponse myInfo = memberService.updateMyInfo(request, customUserPrincipal.getMemberId());
        return ResponseEntity.ok().body(new ApiResponse<>("200", "내 정보 수정 성공", myInfo));
    }

    @PutMapping("/password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody PasswordUpdateRequest request, BindingResult bindingResult,
                                            @AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        ResponseEntity<?> errorResponse = customValidator.validateField(bindingResult);
        if (errorResponse != null) return errorResponse;

        memberService.updatePassword(request, customUserPrincipal.getMemberId());
        return ResponseEntity.ok().body(new ApiResponse<Void>("200", "비밀번호 변경 성공"));
    }

    @DeleteMapping("/my")
    public ResponseEntity<?> deleteMyInfo(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        memberService.deleteMyInfo(customUserPrincipal.getMemberId());
        return ResponseEntity.ok().body(new ApiResponse<Void>("200", "회원탈퇴 성공"));
    }

}

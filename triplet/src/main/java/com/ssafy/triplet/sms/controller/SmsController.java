package com.ssafy.triplet.sms.controller;

import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.sms.dto.request.SmsConfirmRequest;
import com.ssafy.triplet.sms.dto.request.SmsSendRequest;
import com.ssafy.triplet.sms.service.SmsService;
import com.ssafy.triplet.validation.CustomValidator;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/sms")
@RequiredArgsConstructor
public class SmsController {

    private final SmsService smsService;
    private final CustomValidator customValidator;

    @PostMapping("/send")
    public ResponseEntity<?> sendSMS(@Valid @RequestBody SmsSendRequest request, BindingResult bindingResult){
        ResponseEntity<?> errorResponse = customValidator.validateField(bindingResult);
        if (errorResponse != null) return errorResponse;

        smsService.sendSms(request);
        return new ResponseEntity<>(new ApiResponse<Void>("200", "인증번호 요청 성공"), HttpStatus.OK);
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmSMS(@Valid @RequestBody SmsConfirmRequest request, BindingResult bindingResult){
        ResponseEntity<?> errorResponse = customValidator.validateField(bindingResult);
        if (errorResponse != null) return errorResponse;

        if (smsService.verifySms(request)) {
            log.info("인증 성공");
            return new ResponseEntity<>(new ApiResponse<Void>("200", "인증 확인"), HttpStatus.OK);
        }
        log.info("인증 실패");
        return new ResponseEntity<>(new ApiResponse<Void>("M0007", "인증번호가 일치하지 않습니다"), HttpStatus.BAD_REQUEST);
    }

}

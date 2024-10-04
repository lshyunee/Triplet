package com.ssafy.triplet.payment.controller;

import com.ssafy.triplet.payment.dto.request.PaymentRequest;
import com.ssafy.triplet.payment.dto.response.PaymentResponse;
import com.ssafy.triplet.payment.service.PaymentService;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.travel.entity.Merchant;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PaymentController {


    private final PaymentService paymentService;


    @GetMapping("/merchant/{merchantId}")
    public ResponseEntity<?> getMerchant(@PathVariable("merchantId") Long merchantId) {
        Merchant merchant = paymentService.getMerchantById(merchantId);
        if(merchant == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse<>("A0019","가맹점이 존재하지 않습니다."));
        }
        return ResponseEntity.ok().body(new ApiResponse<>("200","가맹점 조회 성공",merchant));
    }

    @PostMapping("/payment")
    public ResponseEntity<?> postPayment(@RequestBody PaymentRequest paymentRequest) {
        PaymentResponse res = paymentService.paymentProcess(paymentRequest);
        return ResponseEntity.ok().body(res);
    }


}

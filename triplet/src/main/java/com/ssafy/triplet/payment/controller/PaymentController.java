package com.ssafy.triplet.payment.controller;

import com.ssafy.triplet.payment.service.PaymentService;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.travel.entity.Merchant;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class PaymentController {


    private final PaymentService paymentService;


    @GetMapping("/merchant/{merchantId}")
    public ResponseEntity<?> getMerchant(@PathVariable("merchantId") Long merchantId) {
        Merchant merchant = paymentService.getMerchantById(merchantId);
        return ResponseEntity.ok().body(new ApiResponse<>("200","가맹점 조회 성공",merchant));
    }
}

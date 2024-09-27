package com.ssafy.triplet.exchange.controller;

import com.ssafy.triplet.exchange.dto.response.ExchangeRateResponse;
import com.ssafy.triplet.exchange.entity.ExchangeRates;
import com.ssafy.triplet.exchange.service.ExchangeRateService;
import com.ssafy.triplet.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ExchangeRateController {

    private final ExchangeRateService exchangeRateService;

    @GetMapping("/exchange-rate-list")
    public ResponseEntity<?> getExchangeRate() {

        List<ExchangeRateResponse> result = exchangeRateService.getExchangeRates();
        return ResponseEntity.ok(new ApiResponse("200","전체 환율 조회 성공",result));
    }

    @GetMapping("/exchange-rate/{currency}")
    public ResponseEntity<?> getExchangeRate(@PathVariable("currency") String currency) {
        ExchangeRates result = exchangeRateService.getExchangeRate(currency);
        if(result == null) {
            return ResponseEntity.badRequest().body(new ApiResponse("C0001","통화 코드가 유효하지 않습니다.",null));
        }
        return ResponseEntity.ok(new ApiResponse("200","단건 환율 조회 성공",result));
    }

}

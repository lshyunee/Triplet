package com.ssafy.triplet.exchange.controller;

import com.ssafy.triplet.auth.dto.CustomUserPrincipal;
import com.ssafy.triplet.exchange.dto.request.ExchangeRateCalculatorRequest;
import com.ssafy.triplet.exchange.entity.ExchangeRates;
import com.ssafy.triplet.exchange.service.ExchangeRateService;
import com.ssafy.triplet.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ExchangeRateController {

    private final ExchangeRateService exchangeRateService;

    @GetMapping("/exchange-rate-list")
    public ResponseEntity<?> getExchangeRate() {

        List<ExchangeRates> result = exchangeRateService.getExchangeRates().stream()
                .sorted(Comparator.comparing(ExchangeRates::getCurrency))
                .collect(Collectors.toList());
        ;
// currency 기준으로 정렬
        result.sort(Comparator.comparing(ExchangeRates::getCurrency));
        return ResponseEntity.ok(new ApiResponse("200", "전체 환율 조회 성공", result));
    }

    @GetMapping("/exchange-rate/{currency}")
    public ResponseEntity<?> getExchangeRate(@PathVariable("currency") String currency) {
        ExchangeRates result = exchangeRateService.getExchangeRate(currency);
        return ResponseEntity.ok(new ApiResponse("200", "단건 환율 조회 성공", result));
    }


    @PostMapping("/exchange-cal")
    public ResponseEntity<?> calExchangeRate(@RequestBody ExchangeRateCalculatorRequest request) {

        Map<String, Object> response = exchangeRateService.calculateExchangeRate(request);

        return ResponseEntity.ok(new ApiResponse("200", (String) response.get("message"), response.get("result")));

    }

    @PostMapping("/exchange")
    public ResponseEntity<?> exchange(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal, @RequestBody ExchangeRateCalculatorRequest request) {


        Map<String, Object> response = exchangeRateService.exchange(customUserPrincipal.getMemberId(),request);

        return ResponseEntity.ok(new ApiResponse("200", "환전 성공", response.get("result")));

    }
}

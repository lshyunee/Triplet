package com.ssafy.triplet.exchange.controller;

import com.ssafy.triplet.exchange.dto.request.ExchangeRateCalculatorRequest;
import com.ssafy.triplet.exchange.dto.response.ExchangeRateCalculatorResponse;
import com.ssafy.triplet.exchange.dto.response.ExchangeRateResponse;
import com.ssafy.triplet.exchange.entity.ExchangeRates;
import com.ssafy.triplet.exchange.service.ExchangeRateService;
import com.ssafy.triplet.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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
        return ResponseEntity.ok(new ApiResponse("200","단건 환율 조회 성공",result));
    }


    @PostMapping("/exchange-cal")
    public ResponseEntity<?> calExchangeRate(@RequestBody ExchangeRateCalculatorRequest request){

        if (request.getSourceCurrency().equals(request.getTargetCurrency())) {
            return ResponseEntity.badRequest().body(new ApiResponse("C0005","동일한 통화로 환전이 불가능합니다.",new ExchangeRateCalculatorResponse(request.getSourceAmount(),request.getSourceAmount())));
        }

        Map<String,Object> response = null;

        if(request.getSourceCurrency().equals("KRW")){
           response =  exchangeRateService.convertToForeignCurrency(request.getSourceAmount(),request.getTargetCurrency());
        }
        else if(request.getTargetCurrency().equals("KRW")){
            response = exchangeRateService.convertToKrwCurrency(request.getSourceAmount(), request.getSourceCurrency());
        }
        else {
            return ResponseEntity.badRequest().body(new ApiResponse("C0002","외화 → 원화 , 원화 → 외화만 가능합니다.",null));
        }
        return ResponseEntity.ok(new ApiResponse("200", (String) response.get("message"),response.get("response")));

    }

}

package com.ssafy.triplet.exchange.service;

import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.exchange.dto.response.ExchangeRateCalculatorResponse;
import com.ssafy.triplet.exchange.dto.response.ExchangeRateResponse;
import com.ssafy.triplet.exchange.entity.ExchangeRates;
import com.ssafy.triplet.exchange.repository.ExchangeRateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ExchangeRateService {


    private final ExchangeRateRepository exchangeRateRepository;

    // 환율 코드 리스트
    List<String> currencies = List.of("GBP", "CAD", "CNY", "EUR", "CHF", "USD", "JPY");


    // 환율 조회 단건
    public ExchangeRates getExchangeRate(String currency) {

        if(!currencies.contains(currency)) {
            throw new CustomException(CustomErrorCode.INVALID_CURRENCY_CODE);
        }

        ExchangeRates result = exchangeRateRepository.findExchangeRateByCurrency(currency);

        return result;

    }

    // 환율 조회 전체
    public List<ExchangeRateResponse> getExchangeRates() {

        // Redis에서 이전, 현재 환률을 불러옴
        Map<String, ExchangeRates> currentExchangeRatesMap = exchangeRateRepository.findAll("currentExchangeRates");
        Map<String, ExchangeRates> previousExchangeRatesMap = exchangeRateRepository.findAll("previousExchangeRates");


        // 사용자에게 응답할 환율 객체로 보냄
        List<ExchangeRateResponse> exchangeRatesList = new ArrayList<>();

        // 환율 코드로 환율 정보를 불러온 후
        // 환율 비교 -> 변화율 계산 -> response에 담아서 리턴
        for (String currency : currencies) {
            ExchangeRates currentExchangeRates = currentExchangeRatesMap.get(currency);
            ExchangeRates previousExchangeRates = previousExchangeRatesMap.get(currency);

            Double currentExchangeRate = Double.valueOf(currentExchangeRates.getExchangeRate().replace(",", ""));
            Double previousExchangeRate = Double.valueOf(previousExchangeRates.getExchangeRate().replace(",", ""));


            ExchangeRateResponse response = ExchangeRateResponse.fromEntity(currentExchangeRates);

            Double changePercentage = ((currentExchangeRate - previousExchangeRate) / previousExchangeRate) * 100;

            response.setChangePercentage(String.format("%.2f", changePercentage));
            response.setChangeStatus((int) Math.signum(changePercentage));

            exchangeRatesList.add(response);

        }

        return exchangeRatesList;


//        System.out.println(exchangeRatesMap.get("USD"));

//        String current = "currentExchangeRates";
//
//
//        List<ExchangeRates> exchangeRates = null;
//        try {
//            exchangeRates = redisTemplate.opsForList().range(current, 0, -1);
//        } catch (Exception e) {
//            log.info("getExchangeRates() : 환율 전체 조회 실패");
//        }

//        return exchangeRates;

    }


    // 환율 계산기 원화 -> 외화
    public Map<String, Object> convertToForeignCurrency(int krwAmount, String targetCurrency) {

        // 유효한 통화코드인지 검사
        validCurrency(targetCurrency);

            String message = "환율 계산 성공";

        ExchangeRates exchangeRates = exchangeRateRepository.findExchangeRateByCurrency(targetCurrency);


        // 최소 환전금액
        int minExchangeRate = exchangeRates.getExchangeMin();

        // 해당 통화의 환율 가져오기
        double exchangeRate = adjustExchangeRate(exchangeRates.getExchangeRate(),targetCurrency);

        int foreignAmount;
        int adjustedKrwAmount;

        // 환전할 외화 금액 계산
        foreignAmount = (int) Math.floor(krwAmount / exchangeRate);
        if (foreignAmount < minExchangeRate) {
            foreignAmount = minExchangeRate;
            message = "환전할 통화의 최소 금액은 " + minExchangeRate + " " + targetCurrency + "입니다.";
        }
        // 엔화의 경우 100 JPY 단위로 잘라야함
        if("JPY".equals(targetCurrency)) {
            foreignAmount -= foreignAmount % 100.0;
        }
        adjustedKrwAmount = (int) Math.floor(foreignAmount * exchangeRate);
        
        return buildResponse(message, adjustedKrwAmount,foreignAmount);
    }


    public Map<String, Object> convertToKrwCurrency(int sourceAmount, String sourceCurrency) {

        // 유효한 통화코드인지 검사
        validCurrency(sourceCurrency);

        String message = "환율 계산 성공";

        ExchangeRates exchangeRates = exchangeRateRepository.findExchangeRateByCurrency(sourceCurrency);


        // 해당 통화의 환율 가져오기
        double exchangeRate = adjustExchangeRate(exchangeRates.getExchangeRate(),sourceCurrency);

        // 해당 통화의 최소 환전 금액 가져오기
        int minExchangeRate = exchangeRates.getExchangeMin();


        if(sourceAmount < minExchangeRate){
            sourceAmount = minExchangeRate;
            message = "환전할 통화의 최소 금액은 " + minExchangeRate + " " + sourceCurrency + "입니다.";
        }

        double adjustedKrwAmount = Math.floor(exchangeRate * sourceAmount);


        return buildResponse(message, sourceAmount,(int) adjustedKrwAmount);
    }

    // 통화코드 유효성 검사
    private void validCurrency(String currency) {
        if(!currencies.contains(currency)) {
            throw new CustomException(CustomErrorCode.INVALID_CURRENCY_CODE);
        }
    }

    
    // 환율 조정
    private double adjustExchangeRate(String rate, String targetCurrency) {
        double exchangeRate = Double.parseDouble(rate);
        if ("JPY".equals(targetCurrency)) {
            exchangeRate /= 100.0;
        }
        return exchangeRate;
    }

    // 반환 값 생성
    private Map<String, Object> buildResponse(String message, int sourceAmount, int targetAmount) {
        Map<String, Object> result = new HashMap<>();
        ExchangeRateCalculatorResponse response = new ExchangeRateCalculatorResponse( sourceAmount, targetAmount);
        result.put("response", response);
        result.put("message", message);
        return result;
    }


}

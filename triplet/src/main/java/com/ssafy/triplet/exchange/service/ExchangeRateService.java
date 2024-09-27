package com.ssafy.triplet.exchange.service;

import com.ssafy.triplet.exchange.dto.response.ExchangeRateResponse;
import com.ssafy.triplet.exchange.entity.ExchangeRates;
import com.ssafy.triplet.exchange.repository.ExchangeRateRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ExchangeRateService {


    private final ExchangeRateRepository exchangeRateRepository;

    // 환율 코드 리스트
    List<String> currencies = List.of("GBP","CAD","CNY","EUR","CHF","USD","JPY");



    public ExchangeRates getExchangeRate(String currency) {

        ExchangeRates result = exchangeRateRepository.findExchangeRateByCurrency(currency);

        return result;

    }

    public List<ExchangeRateResponse> getExchangeRates() {

        // Redis에서 이전, 현재 환률을 불러옴
        Map<String, ExchangeRates> currentExchangeRatesMap = exchangeRateRepository.findAll("currentExchangeRates");
        Map<String, ExchangeRates> previousExchangeRatesMap = exchangeRateRepository.findAll("previousExchangeRates");


        // 사용자에게 응답할 환율 객체로 보냄
        List<ExchangeRateResponse> exchangeRatesList = new ArrayList<>();

        // 환율 코드로 환율 정보를 불러온 후
        // 환율 비교 -> 변화율 계산 -> response에 담아서 리턴
        for(String currency : currencies) {
            ExchangeRates currentExchangeRates = currentExchangeRatesMap.get(currency);
            ExchangeRates previousExchangeRates = previousExchangeRatesMap.get(currency);

            Double currentExchangeRate = Double.valueOf(currentExchangeRates.getExchangeRate().replace(",",""));
            Double previousExchangeRate = Double.valueOf(previousExchangeRates.getExchangeRate().replace(",",""));


            ExchangeRateResponse response = ExchangeRateResponse.fromEntity(currentExchangeRates);

            Double changePercentage = ((currentExchangeRate - previousExchangeRate) /  previousExchangeRate) * 100;

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




}

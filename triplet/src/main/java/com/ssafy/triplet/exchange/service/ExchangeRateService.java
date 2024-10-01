package com.ssafy.triplet.exchange.service;

import com.ssafy.triplet.account.entity.Account;
import com.ssafy.triplet.account.entity.TransactionList;
import com.ssafy.triplet.account.repository.AccountRepository;
import com.ssafy.triplet.account.repository.TransactionListRepository;
import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.exchange.dto.request.ExchangeRateCalculatorRequest;
import com.ssafy.triplet.exchange.dto.response.ExchangeRateCalculatorResponse;
import com.ssafy.triplet.exchange.dto.response.ExchangeRateResponse;
import com.ssafy.triplet.exchange.entity.ExchangeRates;
import com.ssafy.triplet.exchange.repository.ExchangeRateRepository;
import com.ssafy.triplet.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class ExchangeRateService {


    private final ExchangeRateRepository exchangeRateRepository;

    private final AccountRepository accountRepository;

    private final TransactionListRepository transactionListRepository;

    private final MemberRepository memberRepository;

    // 환율 코드 리스트
    List<String> currencies = List.of("GBP", "CAD", "CNY", "EUR", "CHF", "USD", "JPY");

    // 환율 조회 단건
    public ExchangeRates getExchangeRate(String currency) {

        checkCurrency(currency);
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


            response.setChangePercentage(String.format("%.2f", Math.abs(changePercentage)));
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
    public Map<String, Object> convertToForeignCurrency(Long krwAmount, String targetCurrency) {

        String message = "환율 계산 성공";

        ExchangeRates exchangeRates = exchangeRateRepository.findExchangeRateByCurrency(targetCurrency);

        // 최소 환전금액
        int minExchangeRate = exchangeRates.getExchangeMin();

        // 해당 통화의 환율 가져오기
        double exchangeRate = adjustExchangeRate(exchangeRates.getExchangeRate(),targetCurrency);

        Long foreignAmount;
        Long adjustedKrwAmount;

        // 환전할 외화 금액 계산
        foreignAmount = (long) Math.floor(krwAmount / exchangeRate);
        if (foreignAmount < minExchangeRate) {
            foreignAmount = (long) minExchangeRate;
            message = "환전할 통화의 최소 금액은 " + minExchangeRate + " " + targetCurrency + "입니다.";
        }
        // 엔화의 경우 100 JPY 단위로 잘라야함
        if("JPY".equals(targetCurrency)) {
            foreignAmount -= (long) (foreignAmount % 100.0);
        }
        adjustedKrwAmount = (long) Math.floor(foreignAmount * exchangeRate);
        
        return buildResponse(message, adjustedKrwAmount,foreignAmount);
    }


    public Map<String, Object> convertToKrwCurrency(Long sourceAmount, String sourceCurrency) {

        String message = "환율 계산 성공";

        ExchangeRates exchangeRates = exchangeRateRepository.findExchangeRateByCurrency(sourceCurrency);

        // 해당 통화의 환율 가져오기
        double exchangeRate = adjustExchangeRate(exchangeRates.getExchangeRate(),sourceCurrency);

        // 해당 통화의 최소 환전 금액 가져오기
        int minExchangeRate = exchangeRates.getExchangeMin();

        if(sourceAmount < minExchangeRate){
            sourceAmount =(long) minExchangeRate;
            message = "환전할 통화의 최소 금액은 " + minExchangeRate + " " + sourceCurrency + "입니다.";
        }

        double adjustedKrwAmount = Math.floor(exchangeRate * sourceAmount);

        return buildResponse(message, (long) sourceAmount,(long) adjustedKrwAmount);
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
    private Map<String, Object> buildResponse(String message, Long sourceAmount, Long targetAmount) {
        Map<String, Object> result = new HashMap<>();
        ExchangeRateCalculatorResponse response = new ExchangeRateCalculatorResponse( sourceAmount, targetAmount);
        result.put("result", response);
        result.put("message", message);
        return result;
    }

    // 동일한 통화인지 검증
    public void validCurrency(ExchangeRateCalculatorRequest request){
        checkCurrency(request.getSourceCurrency());
        checkCurrency(request.getTargetCurrency());

        if (request.getSourceCurrency().equals(request.getTargetCurrency())) {
            throw new CustomException(CustomErrorCode.SAME_CURRENCY_NOT_ALLOWED_ERROR);
        }
    }

    private void checkCurrency(String currency){

        if(!(currencies.contains(currency)) && !("KRW".equals(currency))){
            throw new CustomException(CustomErrorCode.INVALID_CURRENCY_CODE);
        }
    }

    // 요청 데이터를 보고 원화 -> 외화 인지 외화 -> 원화인지 구분 후 환율 계산
    public Map<String, Object> getCurrentExchangeRateCalculator(ExchangeRateCalculatorRequest request){

        // 환율 유효성 검사
        validCurrency(request);

        Map<String, Object> response = null;

        if(request.getSourceCurrency().equals("KRW")){
            response =  convertToForeignCurrency(request.getSourceAmount(),request.getTargetCurrency());
        }
        else if(request.getTargetCurrency().equals("KRW")){
            response = convertToKrwCurrency(request.getSourceAmount(), request.getSourceCurrency());
        }
        else {
            throw new CustomException(CustomErrorCode.CURRENCY_MISMATCH_ERROR);
        }

        return response;
    }

    @Transactional
    public Map<String, Object> exchange(String memberId, ExchangeRateCalculatorRequest request){

        System.out.println("-----------환전 시작-------------------");
        System.out.println("-----------환전 시작-------------------");
        System.out.println("-----------환전 시작-------------------");
        System.out.println("-----------환전 시작-------------------");
        System.out.println("-----------환전 시작-------------------");
        Long userId = memberRepository.findIdByMemberId(memberId);
        if(userId == null){
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        // 환율 계산
        Map<String, Object> response = getCurrentExchangeRateCalculator(request);
        // 출금 금액, 충전 금액 불러오기
        ExchangeRateCalculatorResponse exchangeRateAmount = (ExchangeRateCalculatorResponse) response.get("result");
        
        // 출금 계좌 정보 조회
        Account sourceAccount = accountRepository.findByMemberIdAndCurrency(userId, request.getSourceCurrency());
        
        if(sourceAccount == null){
            throw new CustomException(CustomErrorCode.WITHDRAWAL_ACCOUNT_NOT_FOUND);
        }

        if(sourceAccount.getAccountBalance() < exchangeRateAmount.getSourceAmount()){
            throw new CustomException(CustomErrorCode.INSUFFICIENT_BALANCE);
        }

        // 입금 계좌 정보 조회
        Account targetAccount = accountRepository.findByMemberIdAndCurrency(userId, request.getTargetCurrency());
        if(targetAccount == null){
            throw new CustomException(CustomErrorCode.DEPOSIT_ACCOUNT_NOT_FOUND);
        }


        // 출금 로직
        // 출금 계좌 정보에 잔액 수정
        sourceAccount.setAccountBalance(sourceAccount.getAccountBalance() - exchangeRateAmount.getSourceAmount());
        accountRepository.save(sourceAccount);


        // 출금 거래내역 생성 및 정보 입력
        TransactionList sourceAccountTransactionList = TransactionList.builder()
                .transactionType(2)
                .transactionTypeName("출금")
                .transactionAccountNumber(targetAccount.getAccountNumber())
                .price(exchangeRateAmount.getSourceAmount())
                .transactionAfterBalance(sourceAccount.getAccountBalance())
                .transactionName("외화 계좌 충전")
                .account(sourceAccount).build();
        
        // 출금 거래내역 저장
        transactionListRepository.save(sourceAccountTransactionList);
        
        // 입금 로직
        // 입금 계좌 정보에 잔액 수정
        targetAccount.setAccountBalance(targetAccount.getAccountBalance() + exchangeRateAmount.getTargetAmount());
        accountRepository.save(targetAccount);

        // 입금 거래내역 생성 및 정보 입력
        TransactionList targetAccountTransactionList = TransactionList.builder()
                .transactionType(2)
                .transactionTypeName("입금")
                .transactionAccountNumber(sourceAccount.getAccountNumber())
                .price(exchangeRateAmount.getTargetAmount())
                .transactionAfterBalance(targetAccount.getAccountBalance())
                .transactionName("외화 계좌 충전")
                .account(targetAccount).build();

        transactionListRepository.save(targetAccountTransactionList);

        return response;
    }




}

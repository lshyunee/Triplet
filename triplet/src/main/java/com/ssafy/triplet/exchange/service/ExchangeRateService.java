package com.ssafy.triplet.exchange.service;

import com.ssafy.triplet.account.entity.Account;
import com.ssafy.triplet.account.entity.TransactionList;
import com.ssafy.triplet.account.repository.AccountRepository;
import com.ssafy.triplet.account.repository.TransactionListRepository;
import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.exchange.dto.request.ExchangeRateCalculatorRequest;
import com.ssafy.triplet.exchange.dto.response.ExchangeRateCalculatorResponse;
import com.ssafy.triplet.exchange.entity.ExchangeRates;
import com.ssafy.triplet.exchange.repository.ExchangeRateRepository;
import com.ssafy.triplet.member.repository.MemberRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class ExchangeRateService {


    private final ExchangeRateRepository exchangeRateRepository;

    private final AccountRepository accountRepository;

    private final TransactionListRepository transactionListRepository;

    private final MemberRepository memberRepository;

    private final List<String> SUPPORTED_CURRENCIES;

    public ExchangeRateService(ExchangeRateRepository exchangeRateRepository, AccountRepository accountRepository, TransactionListRepository transactionListRepository, MemberRepository memberRepository) {
        this.exchangeRateRepository = exchangeRateRepository;
        this.accountRepository = accountRepository;
        this.transactionListRepository = transactionListRepository;
        this.memberRepository = memberRepository;
        this.SUPPORTED_CURRENCIES = exchangeRateRepository.getCurrencies();
    }


    // 단일 환율 조회
    public ExchangeRates getExchangeRate(String currency) {
        validateCurrency(currency);
        return exchangeRateRepository.findExchangeRateByCurrency(currency);
    }

    // 환율 조회 전체
    public List<ExchangeRates> getExchangeRates() {

//        // Redis에서 이전, 현재 환률을 불러옴
//        Map<String, ExchangeRates> currentExchangeRatesMap = exchangeRateRepository.findAll("currentExchangeRates");
//        Map<String, ExchangeRates> previousExchangeRatesMap = exchangeRateRepository.findAll("previousExchangeRates");
//
//
//        // 사용자에게 응답할 환율 객체로 보냄
//        List<ExchangeRateResponse> exchangeRatesList = new ArrayList<>();
//
//        // 환율 코드로 환율 정보를 불러온 후
//        // 환율 비교 -> 변화율 계산 -> response에 담아서 리턴
//        for (String currency : currencies) {
//            ExchangeRates currentExchangeRates = currentExchangeRatesMap.get(currency);
//            ExchangeRates previousExchangeRates = previousExchangeRatesMap.get(currency);
//
//            Double currentExchangeRate = Double.valueOf(currentExchangeRates.getExchangeRate().replace(",", ""));
//            Double previousExchangeRate = Double.valueOf(previousExchangeRates.getExchangeRate().replace(",", ""));
//
//
//            ExchangeRateResponse response = ExchangeRateResponse.fromEntity(currentExchangeRates);
//
//            Double changePercentage = ((currentExchangeRate - previousExchangeRate) / previousExchangeRate) * 100;
//
//
//            response.setChangePercentage(String.format("%.2f", Math.abs(changePercentage)));
//            response.setChangeStatus((int) Math.signum(changePercentage));
//
//            exchangeRatesList.add(response);
//
//        }

        Map<String, ExchangeRates> ExchangeRatesMap = exchangeRateRepository.findAll("currentExchangeRates");

        return ExchangeRatesMap.values().stream().toList();

    }


    // 환율 계산기 원화 -> 외화
    public Map<String, Object> convertToForeignCurrency(Long krwAmount, String targetCurrency) {

        String message = "환율 계산 성공";

        // 계산하려는 통화의 환율 조회
        ExchangeRates exchangeRates = exchangeRateRepository.findExchangeRateByCurrency(targetCurrency);

        // 목표 통화의 최소 환전금액
        int minExchangeAmount = exchangeRates.getExchangeMin();

        // 해당 통화의 환율 가져오기
        double exchangeRate = adjustExchangeRate(exchangeRates.getExchangeRate(), targetCurrency);

        // 환전해야하는 금액을 계산
        long foreignAmount  = (long) Math.floor(krwAmount / exchangeRate);

        // 환전하는 금액이 최소 환전금액보다 작은 경우 조정
        if (foreignAmount < minExchangeAmount) {
            foreignAmount = Math.max(foreignAmount, minExchangeAmount);
            message = "환전할 통화의 최소 금액은 " + minExchangeAmount + " " + targetCurrency + "입니다.";
        }

        // 엔화의 경우 100 JPY 단위로 잘라야함
        if ("JPY".equals(targetCurrency)) {
            foreignAmount -= (long) (foreignAmount % 100.0);
        }
        // 조정된 환전 금액으로 출금해야할 금액 계산
        long adjustedKrwAmount = (long) Math.floor(foreignAmount * exchangeRate);

        return buildResponse(message, adjustedKrwAmount, foreignAmount);
    }


    public Map<String, Object> convertToKrwCurrency(Long sourceAmount, String sourceCurrency) {

        String message = "환율 계산 성공";

        ExchangeRates exchangeRates = exchangeRateRepository.findExchangeRateByCurrency(sourceCurrency);

        // 해당 통화의 환율 가져오기
        double exchangeRate = adjustExchangeRate(exchangeRates.getExchangeRate(), sourceCurrency);

        // 해당 통화의 최소 환전 금액 가져오기
        int minExchangeAmount = exchangeRates.getExchangeMin();

        if (sourceAmount < minExchangeAmount) {
            sourceAmount = Math.max(sourceAmount, minExchangeAmount);
            message = "환전할 통화의 최소 금액은 " + minExchangeAmount + " " + sourceCurrency + "입니다.";
        }

        double adjustedKrwAmount = Math.floor(exchangeRate * sourceAmount);

        return buildResponse(message, sourceAmount, (long) adjustedKrwAmount);
    }


    // 환율 계산 요청 처리
    // 요청 데이터를 보고 원화 -> 외화 인지 외화 -> 원화인지 구분 후 환율 계산
    public Map<String, Object> calculateExchangeRate(ExchangeRateCalculatorRequest request) {
        validateCurrency(request);
        if ("KRW".equals(request.getSourceCurrency())) {
            return convertToForeignCurrency(request.getSourceAmount(), request.getTargetCurrency());
        } else if ("KRW".equals(request.getTargetCurrency())) {
            return convertToKrwCurrency(request.getSourceAmount(), request.getSourceCurrency());
        }
        throw new CustomException(CustomErrorCode.CURRENCY_MISMATCH_ERROR);
    }


    // 환율 조정 메서드
    private double adjustExchangeRate(String rate, String currency) {
        double exchangeRate = Double.parseDouble(rate.replace(",", ""));
        return "JPY".equals(currency) ? exchangeRate / 100.0 : exchangeRate;
    }

    // 반환 값 생성
    private Map<String, Object> buildResponse(String message, Long sourceAmount, Long targetAmount) {
        Map<String, Object> result = new HashMap<>();
        ExchangeRateCalculatorResponse response = new ExchangeRateCalculatorResponse(sourceAmount, targetAmount);
        result.put("result", response);
        result.put("message", message);
        return result;
    }

    // 동일한 통화 검증
    public void validateCurrency(ExchangeRateCalculatorRequest request) {
        validateCurrency(request.getSourceCurrency());
        validateCurrency(request.getTargetCurrency());
        if (request.getSourceCurrency().equals(request.getTargetCurrency())) {
            throw new CustomException(CustomErrorCode.SAME_CURRENCY_NOT_ALLOWED_ERROR);
        }
    }

    // 지원하는 통화인지 검증
    private void validateCurrency(String currency) {
        if (!SUPPORTED_CURRENCIES.contains(currency) && !"KRW".equals(currency)) {
            throw new CustomException(CustomErrorCode.INVALID_CURRENCY_CODE);
        }
    }



    @Transactional
    public Map<String, Object> exchange(String memberId, ExchangeRateCalculatorRequest request) {

        Long userId = memberRepository.findIdByMemberId(memberId);
        if (userId == null) {
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        // 환율 계산
        Map<String, Object> response = calculateExchangeRate(request);
        // 출금 금액, 충전 금액 불러오기
        ExchangeRateCalculatorResponse exchangeRateAmount = (ExchangeRateCalculatorResponse) response.get("result");

        // 출금 계좌 정보 조회
        Account sourceAccount = accountRepository.findByMemberIdAndCurrencyWithMember(userId, request.getSourceCurrency());

        validateAccountBalance(sourceAccount, exchangeRateAmount.getSourceAmount());

        // 입금 계좌 정보 조회
        Account targetAccount = accountRepository.findByMemberIdAndCurrencyWithMember(userId, request.getTargetCurrency());

        validateTargetAccount(targetAccount);

        processTransaction(sourceAccount,targetAccount,exchangeRateAmount);

        return response;
    }


    private void processTransaction(Account sourceAccount, Account targetAccount, ExchangeRateCalculatorResponse exchangeRateAmount) {
        updateAccountBalance(sourceAccount, -exchangeRateAmount.getSourceAmount());
        logTransaction(sourceAccount, exchangeRateAmount.getSourceAmount(), "출금", "환전",targetAccount.getAccountNumber());

        updateAccountBalance(targetAccount, exchangeRateAmount.getTargetAmount());
        logTransaction(targetAccount, exchangeRateAmount.getTargetAmount(), "입금","환전", sourceAccount.getAccountNumber());
    }

    private void updateAccountBalance(Account account, Long amount) {
        account.setAccountBalance(account.getAccountBalance() + amount);
        accountRepository.save(account);
    }


    private void logTransaction(Account account, Long amount, String typeName,String transactionName,String targetAccountNumber) {
        TransactionList transaction = TransactionList.builder()
                .transactionType(2) // 트랜잭션 타입 상수로 치환 가능
                .transactionTypeName(typeName)
                .transactionAccountNumber(targetAccountNumber)
                .price(amount)
                .transactionAfterBalance(account.getAccountBalance())
                .transactionName(transactionName)
                .account(account)
                .build();
        transactionListRepository.save(transaction);
    }



    private void validateAccountBalance(Account account, Long amount) {
        if (account == null) {
            throw new CustomException(CustomErrorCode.WITHDRAWAL_ACCOUNT_NOT_FOUND);
        }
        if (account.getAccountBalance() < amount) {
            throw new CustomException(CustomErrorCode.INSUFFICIENT_BALANCE);
        }
    }

    private void validateTargetAccount(Account account) {
        if (account == null) {
            throw new CustomException(CustomErrorCode.DEPOSIT_ACCOUNT_NOT_FOUND);
        }
    }


}

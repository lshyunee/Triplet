package com.ssafy.triplet.account.service;

import com.ssafy.triplet.account.dto.request.CreateTransactionRequest;
import com.ssafy.triplet.account.dto.request.TransactionListRequest;
import com.ssafy.triplet.account.dto.response.AccountDetailResponse;
import com.ssafy.triplet.account.dto.response.CreateTransactionResponse;
import com.ssafy.triplet.account.dto.response.AccountRechargeResponse;
import com.ssafy.triplet.account.dto.response.TransactionListResponse;
import com.ssafy.triplet.account.entity.Account;
import com.ssafy.triplet.account.entity.TransactionList;
import com.ssafy.triplet.account.repository.AccountRepository;
import com.ssafy.triplet.account.repository.TransactionListRepository;
import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final MemberRepository memberRepository;
    private final TransactionListRepository transactionListRepository;

    // 원화계좌 생성
    public void createAccount(Member member) {
        String accountNumber = generateAccountNumber("000");
        // 계좌 개설일, 만료일은 개설일 + 5년
        LocalDateTime created = LocalDateTime.now();
        LocalDateTime expiry = created.plusYears(5);
        // 원화계좌 생성
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountName("내 통장")
                .accountType("DOMESTIC")
                .currency("KRW")
                .accountCreatedDate(created)
                .accountExpiryDate(expiry).build();
        member.createMyKrwAccount(account);
        accountRepository.save(account);
    }

    // 국가별 외화지갑 자동생성
    public void generateForeignAccounts(Member member) {
        Map<String, String> countryCurrencyMap = new HashMap<>();
        countryCurrencyMap.put("미국", "001");
        countryCurrencyMap.put("유럽", "002");
        countryCurrencyMap.put("일본", "003");
        countryCurrencyMap.put("중국", "004");
        countryCurrencyMap.put("영국", "005");
        countryCurrencyMap.put("스위스", "006");
        countryCurrencyMap.put("캐나다", "007");
        // 국가별 외화지갑 생성
        for (Map.Entry<String, String> entry : countryCurrencyMap.entrySet()) {
            createForeignAccount(member, entry.getValue(), entry.getKey());
        }
    }

    // 외화지갑 생성
    public void createForeignAccount(Member member, String currencyCode, String accountName) {
        Map<String, String> currencyCodeMap = new HashMap<>();
        currencyCodeMap.put("001", "USD");
        currencyCodeMap.put("002", "EUR");
        currencyCodeMap.put("003", "JPY");
        currencyCodeMap.put("004", "CHY");
        currencyCodeMap.put("005", "GBP");
        currencyCodeMap.put("006", "CHF");
        currencyCodeMap.put("007", "CAD");
        // 계좌번호 고유값 생성
        String accountNumber = generateAccountNumber(currencyCode);
        // 계좌 개설일, 만료일은 개설일 + 5년
        LocalDateTime created = LocalDateTime.now();
        LocalDateTime expiry = created.plusYears(5);
        // 외화지갑 생성
        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountName(accountName)
                .accountType("OVERSEAS")
                .currency(currencyCodeMap.get(currencyCode))
                .accountCreatedDate(created)
                .accountExpiryDate(expiry).build();
        member.createMyForeignAccount(account);
        accountRepository.save(account);
    }

    public AccountRechargeResponse findAccountForRecharge(Long memberId, String currency) {
        return accountRepository.findAccountNumberByMemberIdAndCurrency(memberId, currency);
    }

    public void rechargeForTravelAccount(String accountNumber, double accountBalance) {
        accountRepository.rechargeTravelAccount(accountNumber, accountBalance);
    }

    public AccountDetailResponse getKrwAccount(String memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        Account account = member.getKrwAccount();

        return AccountDetailResponse.builder()
                .accountId(account.getAccountId())
                .bankCode(account.getBankCode())
                .bankName(account.getBankName())
                .accountNumber(account.getAccountNumber())
                .accountName(account.getAccountName())
                .accountType(account.getAccountType())
                .currency(account.getCurrency())
                .memberName(member.getName())
                .accountCreatedDate(account.getAccountCreatedDate().toString())
                .accountExpiryDate(account.getAccountExpiryDate().toString())
                .accountBalance(account.getAccountBalance()).build();
    }

    public List<AccountDetailResponse> getForeignAccounts(String memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        return accountRepository.findMyForeignAccounts(memberId).stream()
                .map(foreignAccount -> AccountDetailResponse.builder()
                        .accountId(foreignAccount.getAccountId())
                        .bankCode(foreignAccount.getBankCode())
                        .bankName(foreignAccount.getBankName())
                        .accountNumber(foreignAccount.getAccountNumber())
                        .accountName(foreignAccount.getAccountName())
                        .accountType(foreignAccount.getAccountType())
                        .currency(foreignAccount.getCurrency())
                        .memberName(member.getName())
                        .accountCreatedDate(foreignAccount.getAccountCreatedDate().toString())
                        .accountExpiryDate(foreignAccount.getAccountExpiryDate().toString())
                        .accountBalance(foreignAccount.getAccountBalance()).build()).collect(Collectors.toList());
    }

    public AccountDetailResponse getAccountById(Long accountId) {
        Account account = accountRepository.findById(accountId).orElseThrow(() -> new CustomException(CustomErrorCode.ACCOUNT_NOT_FOUND));
        return AccountDetailResponse.builder()
                .accountId(account.getAccountId())
                .bankCode(account.getBankCode())
                .bankName(account.getBankName())
                .accountNumber(account.getAccountNumber())
                .accountName(account.getAccountName())
                .accountType(account.getAccountType())
                .currency(account.getCurrency())
                .memberName(account.getMember().getName())
                .accountCreatedDate(account.getAccountCreatedDate().toString())
                .accountExpiryDate(account.getAccountExpiryDate().toString())
                .accountBalance(account.getAccountBalance()).build();
    }

    public List<CreateTransactionResponse> createTransaction(CreateTransactionRequest request) {
        Account withdrawalAccount = accountRepository.findByAccountNumber(request.getWithdrawalAccountNumber());
        Account depositAccount = accountRepository.findByAccountNumber(request.getDepositAccountNumber());

        // 거래 가능여부 확인
        isTransactionAllowed(request, withdrawalAccount, depositAccount);

        // 입금 출금
        double withdrawal = withdrawalAccount.getAccountBalance() - request.getTransactionBalance();
        double deposit = depositAccount.getAccountBalance() + request.getTransactionBalance();
        withdrawalAccount.setAccountBalance(withdrawal);
        depositAccount.setAccountBalance(deposit);

        // 거래내역 생성
        TransactionList withdrawalTransaction = TransactionList.builder()
                .transactionType(2)
                .transactionTypeName("출금")
                .transactionAccountNumber(depositAccount.getAccountNumber())
                .price(request.getTransactionBalance())
                .transactionAfterBalance(withdrawal)
                .transactionName("출금").build();
        TransactionList savedWithdrawal = transactionListRepository.save(withdrawalTransaction);
        withdrawalAccount.createTransaction(savedWithdrawal);

        TransactionList depositTransaction = TransactionList.builder()
                .transactionType(1)
                .transactionTypeName("입금")
                .transactionAccountNumber(withdrawalAccount.getAccountNumber())
                .price(request.getTransactionBalance())
                .transactionAfterBalance(deposit)
                .transactionName("입금").build();
        TransactionList savedDeposit = transactionListRepository.save(depositTransaction);
        depositAccount.createTransaction(savedDeposit);

        // 거래내역 반환 Dto
        List<CreateTransactionResponse> responses = new ArrayList<>();
        CreateTransactionResponse withdrawalResponse = CreateTransactionResponse.builder()
                .transactionId(savedWithdrawal.getId())
                .accountNumber(withdrawalAccount.getAccountNumber())
                .transactionDate(withdrawalTransaction.getTransactionDate().toString())
                .transactionType(2)
                .transactionTypeName("출금")
                .transactionAccountNumber(depositAccount.getAccountNumber()).build();
        CreateTransactionResponse depositResponse = CreateTransactionResponse.builder()
                .transactionId(savedDeposit.getId())
                .accountNumber(depositAccount.getAccountNumber())
                .transactionDate(depositTransaction.getTransactionDate().toString())
                .transactionType(1)
                .transactionTypeName("입금")
                .transactionAccountNumber(withdrawalAccount.getAccountNumber()).build();
        responses.add(withdrawalResponse);
        responses.add(depositResponse);
        return responses;
    }

    public List<TransactionListResponse> getTransactionList(TransactionListRequest request) {
        Long accountId = request.getAccountId();
        accountRepository.findById(accountId).orElseThrow(() -> new CustomException(CustomErrorCode.ACCOUNT_NOT_FOUND));
        return transactionListRepository.findByAccountId(accountId).stream()
                .map(tre -> TransactionListResponse.builder()
                        .transactionId(tre.getId())
                        .transactionDate(tre.getTransactionDate().toString())
                        .transactionType(tre.getTransactionType())
                        .transactionTypeName(tre.getTransactionTypeName())
                        .transactionAccountNumber(tre.getTransactionAccountNumber())
                        .price(tre.getPrice())
                        .transactionAfterBalance(tre.getTransactionAfterBalance())
                        .transactionName(tre.getTransactionName()).build()).collect(Collectors.toList());
    }

    private static void isTransactionAllowed(CreateTransactionRequest request, Account withdrawalAccount, Account depositAccount) {
        // 계좌 존재여부 확인
        if (withdrawalAccount == null) {
            throw new CustomException(CustomErrorCode.WITHDRAWAL_ACCOUNT_NOT_FOUND);
        }
        if (depositAccount == null) {
            throw new CustomException(CustomErrorCode.DEPOSIT_ACCOUNT_NOT_FOUND);
        }

        // 원화계좌인지 확인
        if (!"DOMESTIC".equals(withdrawalAccount.getAccountType()) || !"DOMESTIC".equals(depositAccount.getAccountType())) {
            throw new CustomException(CustomErrorCode.KRW_ACCOUNT_ONLY);
        }

        // 출금계좌에 잔액 확인
        if (withdrawalAccount.getAccountBalance() < request.getTransactionBalance()) {
            throw new CustomException(CustomErrorCode.INSUFFICIENT_BALANCE);
        }
    }

    // 계좌번호 생성: 은행코드(124) + 랜덤8자리 수 + 통화코드(3자리)
    private String generateAccountNumber(String currency) {
        String accountNumber;
        do {
            Random random = new Random();
            // 8자리 랜덤수
            int randomNumber = random.nextInt(100000000);
            String formattedNumber = String.format("%08d", randomNumber);
            accountNumber = "124" + formattedNumber + currency;
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

}

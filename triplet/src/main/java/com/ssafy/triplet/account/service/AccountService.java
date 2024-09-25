package com.ssafy.triplet.account.service;

import com.ssafy.triplet.account.dto.request.CreateTransactionRequest;
import com.ssafy.triplet.account.dto.request.TransactionListRequest;
import com.ssafy.triplet.account.dto.response.AccountDetailResponse;
import com.ssafy.triplet.account.dto.response.CreateTransactionResponse;
import com.ssafy.triplet.account.dto.response.ForeignAccountRechargeResponse;
import com.ssafy.triplet.account.dto.response.TransactionListResponse;
import com.ssafy.triplet.account.entity.ForeignAccount;
import com.ssafy.triplet.account.entity.KrwAccount;
import com.ssafy.triplet.account.repository.ForeignAccountRepository;
import com.ssafy.triplet.account.repository.ForeignTransactionListRepository;
import com.ssafy.triplet.account.repository.KrwAccountRepository;
import com.ssafy.triplet.account.repository.TransactionListRepository;
import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AccountService {

    private final ForeignAccountRepository foreignAccountRepository;
    private final KrwAccountRepository krwAccountRepository;
    private final MemberRepository memberRepository;
    private final TransactionListRepository transactionListRepository;
    private final ForeignTransactionListRepository foreignTransactionListRepository;

    // 원화계좌 생성
    public void createAccount(Member member) {
        String accountNumber = generateAccountNumber("000");
        // 계좌 개설일, 만료일은 개설일 + 5년
        LocalDateTime created = LocalDateTime.now();
        LocalDateTime expiry = created.plusYears(5);
        // 원화계좌 생성
        KrwAccount krwAccount = new KrwAccount(accountNumber, created, expiry);
        member.createMyKrwAccount(krwAccount);
        krwAccountRepository.save(krwAccount);
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
    public void createForeignAccount(Member member, String currency, String accountName) {
        // 계좌번호 고유값 생성
        String accountNumber = generateAccountNumber(currency);
        // 계좌 개설일, 만료일은 개설일 + 5년
        LocalDateTime created = LocalDateTime.now();
        LocalDateTime expiry = created.plusYears(5);
        // 외화지갑 생성
        ForeignAccount foreignAccount = new ForeignAccount(accountNumber, accountName, currency, created, expiry);
        member.createMyForeignAccount(foreignAccount);
        foreignAccountRepository.save(foreignAccount);
    }

    public ForeignAccountRechargeResponse findAccountForRecharge(Long memberId, String currency) {
        return foreignAccountRepository.findAccountNumberByMemberIdAndCurrency(memberId, currency);
    }

    public void rechargeForTravelAccount(String accountNumber, double accountBalance) {
        foreignAccountRepository.rechargeTravelAccount(accountNumber, accountBalance);
    }

    public AccountDetailResponse getKrwAccount(String memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        KrwAccount krwAccount = member.getKrwAccount();
        if (krwAccount == null) {
            return null;
        }

        return AccountDetailResponse.builder()
                .accountId(krwAccount.getAccountId())
                .bankCode(krwAccount.getBankCode())
                .bankName(krwAccount.getBankName())
                .accountNumber(krwAccount.getAccountNumber())
                .accountName(krwAccount.getAccountName())
                .accountType(krwAccount.getAccountType())
                .currency(krwAccount.getCurrency())
                .memberName(member.getName())
                .accountCreatedDate(krwAccount.getAccountCreatedDate().toString())
                .accountExpiryDate(krwAccount.getAccountExpiryDate().toString())
                .accountBalance(krwAccount.getAccountBalance()).build();
    }

    public List<AccountDetailResponse> getForeignAccounts(String memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        return foreignAccountRepository.findMyForeignAccounts(memberId).stream()
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
        KrwAccount krwAccount = krwAccountRepository.findById(accountId).orElse(null);
        ForeignAccount foreignAccount = foreignAccountRepository.findById(accountId).orElse(null);
        if (krwAccount != null) {
            return AccountDetailResponse.builder()
                    .accountId(krwAccount.getAccountId())
                    .bankCode(krwAccount.getBankCode())
                    .bankName(krwAccount.getBankName())
                    .accountNumber(krwAccount.getAccountNumber())
                    .accountName(krwAccount.getAccountName())
                    .accountType(krwAccount.getAccountType())
                    .currency(krwAccount.getCurrency())
                    .memberName(krwAccount.getMember().getName())
                    .accountCreatedDate(krwAccount.getAccountCreatedDate().toString())
                    .accountExpiryDate(krwAccount.getAccountExpiryDate().toString())
                    .accountBalance(krwAccount.getAccountBalance()).build();
        } else if (foreignAccount != null) {
            return AccountDetailResponse.builder()
                    .accountId(foreignAccount.getAccountId())
                    .bankCode(foreignAccount.getBankCode())
                    .bankName(foreignAccount.getBankName())
                    .accountNumber(foreignAccount.getAccountNumber())
                    .accountName(foreignAccount.getAccountName())
                    .accountType(foreignAccount.getAccountType())
                    .currency(foreignAccount.getCurrency())
                    .memberName(foreignAccount.getMember().getName())
                    .accountCreatedDate(foreignAccount.getAccountCreatedDate().toString())
                    .accountExpiryDate(foreignAccount.getAccountExpiryDate().toString())
                    .accountBalance(foreignAccount.getAccountBalance()).build();
        } else {
            throw new CustomException(CustomErrorCode.ACCOUNT_NOT_FOUND);
        }
    }

//    public List<CreateTransactionResponse> createTransaction(CreateTransactionRequest request) {
//        KrwAccount withdrawalAccount = krwAccountRepository.findByAccountNumber(request.getWithdrawalAccountNumber());
//        if (withdrawalAccount == null) {
//            throw new CustomException(CustomErrorCode.ACCOUNT_NOT_FOUND);
//        }
//        double currentBalance = withdrawalAccount.getAccountBalance();
//        double newBalance = currentBalance - request.getTransactionBalance();
//
//    }

    public List<TransactionListResponse> getTransactionList(TransactionListRequest request) {
        Long accountId = request.getAccountId();
        if (krwAccountRepository.existsByAccountId(accountId)) {
            return transactionListRepository.findByKrwAccountId(accountId).stream()
                    .map(tre -> TransactionListResponse.builder()
                            .transactionId(tre.getId())
                            .transactionDate(tre.getTransactionDate().toString())
                            .transactionType(tre.getTransactionType())
                            .transactionTypeName(tre.getTransactionTypeName())
                            .transactionAccountNumber(tre.getTransactionAccountNumber())
                            .price(tre.getPrice())
                            .transactionAfterBalance(tre.getTransactionAfterBalance())
                            .transactionName(tre.getTransactionName()).build()).collect(Collectors.toList());
        } else if (foreignAccountRepository.existsByAccountId(accountId)) {
            return foreignTransactionListRepository.findByForeignAccountId(accountId).stream()
                    .map(ftre -> TransactionListResponse.builder()
                            .transactionId(ftre.getId())
                            .transactionDate(ftre.getTransactionDate().toString())
                            .transactionType(ftre.getTransactionType())
                            .transactionTypeName(ftre.getTransactionTypeName())
                            .transactionAccountNumber(ftre.getTransactionAccountNumber())
                            .price(ftre.getPrice())
                            .transactionAfterBalance(ftre.getTransactionAfterBalance())
                            .transactionName(ftre.getTransactionName()).build()).collect(Collectors.toList());
        } else {
            throw new CustomException(CustomErrorCode.ACCOUNT_NOT_FOUND);
        }
    }

    private String generateAccountNumber(String currency) {
        String accountNumber;
        do {
            String uuid = UUID.randomUUID().toString().replace("-", "");
            String sub = uuid.substring(0, 8);  // UUID에서 앞 16자리만 사용
            accountNumber = "124" + sub + currency;
        } while (krwAccountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

}

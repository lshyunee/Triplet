package com.ssafy.triplet.account.service;

import com.ssafy.triplet.account.dto.request.TransactionListRequest;
import com.ssafy.triplet.account.dto.response.CreateAccountResponse;
import com.ssafy.triplet.account.dto.response.CurrencyResponse;
import com.ssafy.triplet.account.dto.response.AccountDetailResponse;
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

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final ForeignAccountRepository foreignAccountRepository;
    private final KrwAccountRepository krwAccountRepository;
    private final MemberRepository memberRepository;
    private final TransactionListRepository transactionListRepository;
    private final ForeignTransactionListRepository foreignTransactionListRepository;

    public CreateAccountResponse createAccount(String memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        // 계좌번호 고유값 생성
        String accountNumber;
        do {
            accountNumber = generateAccountNumber();
        } while (krwAccountRepository.existsByAccountNumber(accountNumber));
        // 계좌 개설일, 만료일은 개설일 + 5년
        LocalDateTime created = LocalDateTime.now();
        LocalDateTime expiry = created.plusYears(5);

        KrwAccount krwAccount = new KrwAccount(accountNumber, created, expiry);
        member.createMyKrwAccount(krwAccount);
        krwAccountRepository.save(krwAccount);

        return CreateAccountResponse.builder()
                .accountId(krwAccount.getAccountId())
                .bankCode(krwAccount.getBankCode())
                .accountNumber(krwAccount.getAccountNumber())
                .accountType(krwAccount.getAccountType())
                .currency(krwAccount.getCurrency()).build();
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

    public void deleteAccountById(Long accountId) {
        if (krwAccountRepository.existsByAccountId(accountId)) {
            krwAccountRepository.deleteById(accountId);
        } else if (foreignAccountRepository.existsByAccountId(accountId)) {
            foreignAccountRepository.deleteById(accountId);
        } else {
            throw new CustomException(CustomErrorCode.ACCOUNT_NOT_FOUND);
        }
    }

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

    private String generateAccountNumber() {
        String uuid = UUID.randomUUID().toString().replace("-", "");
        return uuid.substring(0, 16);  // UUID에서 앞 16자리만 사용
    }

}

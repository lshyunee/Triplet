package com.ssafy.triplet.account.controller;

import com.ssafy.triplet.account.dto.request.CreateTransactionRequest;
import com.ssafy.triplet.account.dto.request.TransactionListRequest;
import com.ssafy.triplet.account.dto.response.AccountDetailResponse;
import com.ssafy.triplet.account.dto.response.TransactionListResponse;
import com.ssafy.triplet.account.service.AccountService;
import com.ssafy.triplet.auth.dto.CustomUserPrincipal;
import com.ssafy.triplet.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequestMapping("/api/v1")
@RestController
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/account")
    public ResponseEntity<?> findAccount(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        AccountDetailResponse krwAccount = accountService.getKrwAccount(customUserPrincipal.getMemberId());
        if (krwAccount == null) {
            return ResponseEntity.ok().body(new ApiResponse<Void>("200", "원화계좌가 존재하지 않습니다."));
        }
        return ResponseEntity.ok().body(new ApiResponse<>("200", "원화계좌 조회 성공", krwAccount));
    }

    @GetMapping("/foreign-account")
    public ResponseEntity<?> findForeignAccounts(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        List<AccountDetailResponse> foreignAccounts = accountService.getForeignAccounts(customUserPrincipal.getMemberId());
        return ResponseEntity.ok().body(new ApiResponse<>("200", "외화계좌 목록 조회 성공", foreignAccounts));
    }

    @GetMapping("/account/{accountId}")
    public ResponseEntity<?> findAccountById(@PathVariable("accountId") Long accountId) {
        AccountDetailResponse accountById = accountService.getAccountById(accountId);
        return ResponseEntity.ok().body(new ApiResponse<>("200", "계좌 상세조회 성공", accountById));
    }

    @PostMapping("/transaction")
    public ResponseEntity<?> findTransactions(@RequestBody TransactionListRequest request) {
        List<TransactionListResponse> transactionList = accountService.getTransactionList(request);
        return ResponseEntity.ok().body(new ApiResponse<>("200", "거래내역 조회 성공", transactionList));
    }

//    @PostMapping("/transaction/create")
//    public ResponseEntity<?> createTransaction(@RequestBody CreateTransactionRequest request) {
//
//    }

}

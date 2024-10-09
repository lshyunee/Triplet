package com.ssafy.triplet.account.controller;

import com.ssafy.triplet.account.dto.request.CreateTransactionRequest;
import com.ssafy.triplet.account.dto.request.TransactionListRequest;
import com.ssafy.triplet.account.dto.response.AccountDetailResponse;
import com.ssafy.triplet.account.dto.response.CreateTransactionResponse;
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
import java.util.Map;

@Slf4j
@RequestMapping("/api/v1")
@RestController
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping("/account")
    public ResponseEntity<?> findAccount(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        AccountDetailResponse krwAccount = accountService.getKrwAccount(customUserPrincipal.getMemberId());
        return ResponseEntity.ok().body(new ApiResponse<>("200", "원화계좌 조회 성공", krwAccount));
    }

    @GetMapping("/foreign-account/{currency}")
    public ResponseEntity<?> findForeignAccount(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
                                                @PathVariable String currency) {
        AccountDetailResponse foreignAccount = accountService.getForeignAccount(customUserPrincipal.getMemberId(), currency);
        return ResponseEntity.ok().body(new ApiResponse<>("200", "외화계좌 조회 성공", foreignAccount));
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
        Map<String, List<TransactionListResponse>> transactions = accountService.getTransactionList(request);
        return ResponseEntity.ok().body(new ApiResponse<>("200", "거래내역 조회 성공", transactions));
    }

    @PostMapping("/transaction/create")
    public ResponseEntity<?> createTransaction(@RequestBody CreateTransactionRequest request) {
        List<CreateTransactionResponse> transaction = accountService.createTransaction(request);
        return ResponseEntity.ok().body(new ApiResponse<>("200", "원화계좌 송금 성공", transaction));
    }

}

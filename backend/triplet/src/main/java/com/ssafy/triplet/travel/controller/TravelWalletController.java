package com.ssafy.triplet.travel.controller;

import com.ssafy.triplet.auth.dto.CustomUserPrincipal;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.repository.MemberRepository;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.travel.dto.request.TravelWalletRechargeRequest;
import com.ssafy.triplet.travel.dto.response.TransactionListResponse;
import com.ssafy.triplet.travel.dto.response.TravelWalletResponse;
import com.ssafy.triplet.travel.service.TravelWalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/travel-wallet")
@RequiredArgsConstructor
public class TravelWalletController {
    private final TravelWalletService travelWalletService;
    private final MemberRepository memberRepository;

    @GetMapping("/transaction/{travelId}")
    public ResponseEntity<ApiResponse<List<TransactionListResponse>>> getTransactions(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
                                                                                      @PathVariable Long travelId) {
        try {
            List<TransactionListResponse> list = travelWalletService.getTransactionList(travelId);
            if (list.isEmpty()) {
                ResponseEntity.ok(new ApiResponse<>("200", "거래 내역이 없습니다."));
            }
            return ResponseEntity.ok(new ApiResponse<>("200", "거래 내역이 조회되었습니다.", list));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PutMapping("/transaction/{transactionId}/{categoryId}")
    public ResponseEntity<ApiResponse<TransactionListResponse>> updateTransaction(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
                                                                                  @PathVariable Long transactionId, @PathVariable int categoryId) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("200", "거래 내역이 수정되었습니다.", travelWalletService.modifyTransaction(transactionId, categoryId)));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping("/recharge")
    public ResponseEntity<ApiResponse<TransactionListResponse>> recharge(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
                                                                         @RequestBody TravelWalletRechargeRequest request) {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            TransactionListResponse response = travelWalletService.rechargeTravelWallet(userId, request, 7);
            return ResponseEntity.ok(new ApiResponse<>("200", "충전이 완료되었습니다.", response));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping("/return")
    public ResponseEntity<ApiResponse<TransactionListResponse>> returnCost(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
                                                                         @RequestBody TravelWalletRechargeRequest request) {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            TransactionListResponse response = travelWalletService.returnTravelWallet(userId, request, 8);
            return ResponseEntity.ok(new ApiResponse<>("200", "반환이 완료되었습니다.", response));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/{travelId}")
    public ResponseEntity<ApiResponse<TravelWalletResponse>> getTravelWallet(@PathVariable Long travelId) {
        try {
            return ResponseEntity.ok(new ApiResponse<>("200", "조회가 완료되었습니다.", travelWalletService.getTravelWallet(travelId)));
        } catch (Exception e) {
            return handleException(e);
        }
    }



    // 예외처리 메서드
    private <T> ResponseEntity<ApiResponse<T>> handleException(Exception e) {
        if (e instanceof CustomException customException) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(customException.getErrorCode(), customException.getMessage()));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("E0000", "서버 에러가 발생했습니다." + e.getMessage()));
        }
    }
}

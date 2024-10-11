package com.ssafy.triplet.account.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class CreateTransactionRequest {

    @NotNull(message = "계좌번호가 유효하지 않습니다.")
    private String depositAccountNumber; // 입금계좌
    @NotNull(message = "거래 금액이 유효하지 않습니다.")
    private double transactionBalance; // 거래금액
    @NotNull(message = "계좌번호가 유효하지 않습니다.")
    private String withdrawalAccountNumber; // 출금계좌번호

}

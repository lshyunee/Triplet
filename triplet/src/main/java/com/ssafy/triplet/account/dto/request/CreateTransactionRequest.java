package com.ssafy.triplet.account.dto.request;

import lombok.Getter;

@Getter
public class CreateTransactionRequest {

    private String depositAccountNumber; // 입금계좌
    private double transactionBalance; // 거래금액
    private String withdrawalAccountNumber; // 출금계좌번호

}

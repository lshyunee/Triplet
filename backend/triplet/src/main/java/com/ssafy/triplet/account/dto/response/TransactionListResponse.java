package com.ssafy.triplet.account.dto.response;

import lombok.*;

@Builder
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class TransactionListResponse {

    private Long transactionId;
    private String transactionDate;
    private int transactionType; // 1: 입금, 2: 출금
    private String transactionTypeName;
    private String transactionAccountNumber;
    private double price;
    private double transactionAfterBalance;
    private String transactionName;

}

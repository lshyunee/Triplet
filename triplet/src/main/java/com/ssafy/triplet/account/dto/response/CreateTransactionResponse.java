package com.ssafy.triplet.account.dto.response;

import lombok.*;

@Builder
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreateTransactionResponse {

    private Long transactionId;
    private String accountNumber;
    private String transactionDate;
    private int transactionType;
    private String transactionTypeName;
    private String transactionAccountNumber;

}

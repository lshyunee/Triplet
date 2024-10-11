package com.ssafy.triplet.account.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AccountDetailResponse {

    private Long accountId;
    private String bankCode;
    private String bankName;
    private String accountNumber;
    private String accountName;
    private String accountType;
    private String currency;
    private String memberName;
    private String accountCreatedDate;
    private String accountExpiryDate;
    private double accountBalance;

}

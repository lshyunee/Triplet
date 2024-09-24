package com.ssafy.triplet.account.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreateAccountResponse {

    private Long accountId;
    private String bankCode;
    private String accountNumber;
    private String accountType;
    private String currency;

}

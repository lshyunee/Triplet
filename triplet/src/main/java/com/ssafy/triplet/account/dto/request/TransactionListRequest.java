package com.ssafy.triplet.account.dto.request;

import lombok.Getter;


@Getter
public class TransactionListRequest {

    private Long accountId;
    private String startDate;
    private String endDate;

}

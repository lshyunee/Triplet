package com.ssafy.triplet.account.dto.request;

import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class TransactionListRequest {

    private Long accountId;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String transactionType;
    private String orderByType;

}

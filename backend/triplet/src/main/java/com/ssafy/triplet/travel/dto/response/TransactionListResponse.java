package com.ssafy.triplet.travel.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TransactionListResponse {
    private Long transactionId;
    private double price;
    private LocalDateTime transactionDate;
    private double balance;
    private String categoryName;
    private int categoryId;
    private String merchantName;
    private Long travelId;
}

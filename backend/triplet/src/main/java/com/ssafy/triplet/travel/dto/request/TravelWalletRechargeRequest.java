package com.ssafy.triplet.travel.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TravelWalletRechargeRequest {
    private Long travelId;
    private double chargeCost;
    private LocalDateTime transactionDate;
}

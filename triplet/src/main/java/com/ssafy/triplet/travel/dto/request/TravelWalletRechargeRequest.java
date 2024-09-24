package com.ssafy.triplet.travel.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TravelWalletRechargeRequest {
    private Long travelId;
    private double chargeCost;
}

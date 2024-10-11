package com.ssafy.triplet.travel.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TravelWalletResponse {
    private Long walletId;
    private String currency;
    private double balance;
    private boolean share;
}

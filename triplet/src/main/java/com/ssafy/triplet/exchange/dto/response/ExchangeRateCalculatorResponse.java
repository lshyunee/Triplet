package com.ssafy.triplet.exchange.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExchangeRateCalculatorResponse {

    private int sourceAmount;

    private int targetAmount;



}

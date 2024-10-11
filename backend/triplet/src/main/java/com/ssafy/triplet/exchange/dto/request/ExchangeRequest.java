package com.ssafy.triplet.exchange.dto.request;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeRequest {

    @NotNull(message = "targetCurrency 누락")
    String targetCurrency;

    @NotNull(message = "sourceCurrency 누락")
    String sourceCurrency;

    @NotNull(message = "sourceAmount 누락")
    int sourceAmount;

}

package com.ssafy.triplet.exchange.dto.request;


import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExchangeRateCalculatorRequest {

    @NotNull(message = "targetCurrency 누락")
    String targetCurrency;

    @NotNull(message = "sourceCurrency 누락")
    String sourceCurrency;

    @NotNull(message = "sourceAmount 누락")
    Long sourceAmount;

}
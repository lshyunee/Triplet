package com.ssafy.triplet.exchange.dto.response;

import com.ssafy.triplet.exchange.entity.ExchangeRates;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class ExchangeRateResponse {

    int id;

    String currency;

    String exchangeRate;

    String created;

    String exchangeMin;

    // 환율 변화율
    String changePercentage;

    // 환율 변화 상태 -1 : 하락, 0: 변화없음 1: 상승
    int changeStatus;

    public static ExchangeRateResponse fromEntity(ExchangeRates exchangeRates) {
        return ExchangeRateResponse.builder().id(exchangeRates.getId())
                .currency(exchangeRates.getCurrency())
                .exchangeRate(exchangeRates.getExchangeRate())
                .exchangeMin(exchangeRates.getExchangeMin())
                .created(exchangeRates.getCreated())
                .build();
    }
}

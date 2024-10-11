package com.ssafy.triplet.exchange.entity;

import jakarta.persistence.Id;
import lombok.*;
import org.springframework.data.redis.core.RedisHash;

@RedisHash
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ExchangeRates {

    @Id
    int id;

    String currency;

    String exchangeRate;

    String created;

    int exchangeMin;

    // 환율 변화율
    String changePercentage;

    // 환율 변화 상태 -1 : 하락, 0: 변화없음 1: 상승
    int changeStatus;

}

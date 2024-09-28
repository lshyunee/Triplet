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

}

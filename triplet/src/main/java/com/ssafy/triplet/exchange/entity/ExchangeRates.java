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

    String exchangeMin;


    // 외부 환율 조회 API 를 통해 불러온 결과값을 redis에 저장하기 위한 도메인
    // 1. Spring 스케줄러로 API 호출 후 결과값 exchangeRates 로 파싱 후 Redis에 저장
    // 2. Redis에서 불러와서 반환
}

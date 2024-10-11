package com.ssafy.triplet.sms.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Repository;

import java.time.Duration;

@Repository
@RequiredArgsConstructor
public class SmsRepository {

    private final String PREFIX = "sms:"; // Redis 키에 사용할 접두사
    private final StringRedisTemplate stringRedisTemplate;

    // SMS 인증 정보 생성 (휴대폰번호 : 인증코드)
    public void createSmsCertification(String phoneNumber, String code){
        stringRedisTemplate.opsForValue()
                .set(PREFIX + phoneNumber, code, Duration.ofSeconds(5 * 60)); // 유효시간 5분
    }

    // 휴대폰 번호로 SMS 인증 정보 조회
    public String getSmsCertification(String phoneNumber){
        return stringRedisTemplate.opsForValue().get(PREFIX + phoneNumber);
    }

    // 휴대폰 번호로 SMS 인증 정보 삭제
    public void deleteSmsCertification(String phoneNumber){
        stringRedisTemplate.delete(PREFIX + phoneNumber);
    }

    // 해당 번호에 관한 인증 정보가 존재하는지 확인
    public boolean isExist(String phoneNumber){
        // NullPoint 방지를 위해 Boolean.TRUE.equals 로 처리
        return Boolean.TRUE.equals(stringRedisTemplate.hasKey(PREFIX + phoneNumber));
    }
}
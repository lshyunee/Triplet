package com.ssafy.triplet.travel.util;

import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Random;

@Component
public class InviteCodeGenerator {
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 6;

    // RedisTemplate 주석 처리
    // private final RedisTemplate<String, String> redisTemplate;

    // public InviteCodeGenerator(RedisTemplate<String, String> redisTemplate) {
    //    this.redisTemplate = redisTemplate;
    // }

    public String generateInviteCode(LocalDate travelEndTime) {
        String inviteCode;
//        do {
            inviteCode = createRandomCode();
//        }
        // Redis 관련 코드 주석 처리
        // while (redisTemplate.hasKey(inviteCode));

        // Redis에 inviteCode 저장하는 부분 주석 처리
        // LocalDate now = LocalDate.now();
        // long daysUntilEnd = ChronoUnit.DAYS.between(now, travelEndTime);
        // redisTemplate.opsForValue().set(inviteCode, inviteCode, daysUntilEnd, TimeUnit.DAYS);

        return inviteCode;
    }

    private String createRandomCode() {
        Random random = new Random();
        StringBuilder inviteCode = new StringBuilder(CODE_LENGTH);

        for (int i = 0; i < CODE_LENGTH; i++) {
            inviteCode.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }

        return inviteCode.toString();
    }

    // updateInviteCodeExpiry 메서드 주석 처리
    // public void updateInviteCodeExpiry(String inviteCode, LocalDate newEndDate) {
    //    if (redisTemplate.hasKey(inviteCode)) {
    //        LocalDate now = LocalDate.now();
    //        long daysUntilEnd = ChronoUnit.DAYS.between(now, newEndDate);
    //        redisTemplate.opsForValue().set(inviteCode, inviteCode, daysUntilEnd, TimeUnit.DAYS);
    //    }
    // }
}

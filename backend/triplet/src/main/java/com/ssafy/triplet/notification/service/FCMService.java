package com.ssafy.triplet.notification.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushNotification;
import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import com.ssafy.triplet.notification.dto.FcmTokenDto;
import com.ssafy.triplet.notification.dto.NotificationEnableDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class FCMService {

    private final MemberRepository memberRepository;
    private final StringRedisTemplate redisTemplate;

    // FireBase 토큰 redis에 저장
    public FcmTokenDto saveToken(FcmTokenDto fcmTokenDto, String member_id) {
        try {
            Member member = memberRepository.findByMemberId(member_id);
            if (member == null) {
                throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
            }
            redisTemplate.opsForValue().set(member_id, fcmTokenDto.getToken());
        } catch (Exception e) {
            throw new CustomException(CustomErrorCode.TOKEN_SAVE_FAIL);
        }
        return fcmTokenDto;
    }


    // 사용자에게 push 알림
    public String pushNotification(String member_id, String title, String content) {
        String result = "";
        try {
            Member member = memberRepository.findByMemberId(member_id);
            if (member == null) {
                throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
            }

            if (!redisTemplate.hasKey(member.getMemberId())) {
                throw new CustomException(CustomErrorCode.DEVICE_TOKEN_NOT_FOUND);
            } else {
                String token = redisTemplate.opsForValue().get(member_id);
                Message message = Message.builder()
                        .setToken(token)
                        .setWebpushConfig(WebpushConfig.builder()
                                .putHeader("ttl", "300")
                                .setNotification(new WebpushNotification(title, content))
                                .build())
                        .build();
                result = FirebaseMessaging.getInstance().sendAsync(message).get();

            }
        } catch (Exception e) {
            log.info("Push 알림 발송 오류 ");
            System.out.println(e.getMessage());
        }

        return result;
    }


    // 사용자에게 push 알림
    public String pushNotificationPay(String memberId, String title, String content) {
        String result = "";
        try {
            String token = redisTemplate.opsForValue().get(memberId);
            Message message = Message.builder()
                    .setToken(token)
                    .setWebpushConfig(WebpushConfig.builder()
                            .putHeader("ttl", "300")
                            .setNotification(new WebpushNotification(title, content))
                            .build())
                    .build();
            result = FirebaseMessaging.getInstance().sendAsync(message).get();
        } catch (Exception e) {
            log.info("Push 알림 발송 오류 ");
            System.out.println(e.getMessage());
        }

        return result;
    }

    public boolean getNotificationEnabled(String memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        return member.getIsNotificationEnabled();
    }

    public boolean updateEnableNotification(String memberId, NotificationEnableDto enable) {
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        member.setIsNotificationEnabled(enable.isEnable());
        memberRepository.save(member);
        return true;
    }
}
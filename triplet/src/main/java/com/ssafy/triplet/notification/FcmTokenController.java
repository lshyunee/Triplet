package com.ssafy.triplet.notification;

import com.ssafy.triplet.auth.dto.CustomUserPrincipal;
import com.ssafy.triplet.notification.dto.FcmTokenDto;
import com.ssafy.triplet.notification.dto.NotificationEnableDto;
import com.ssafy.triplet.notification.service.FCMService;
import com.ssafy.triplet.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/token")
@RequiredArgsConstructor
public class FcmTokenController {

    private final FCMService fcmService;

    @PostMapping("")
    public ResponseEntity<?> saveToken(@RequestBody FcmTokenDto tokenDto, @AuthenticationPrincipal CustomUserPrincipal customUserPrincipal){

        fcmService.saveToken(tokenDto,customUserPrincipal.getMemberId());

        return ResponseEntity.ok(new ApiResponse<>("200","Device Token 저장 성공",tokenDto));

    }
    @PostMapping("/test")
    public ResponseEntity<?> sendTest(String message, @AuthenticationPrincipal CustomUserPrincipal customUserPrincipal){

        String res = fcmService.pushNotification(customUserPrincipal.getMemberId(),"test",message);
        return ResponseEntity.ok(new ApiResponse<>("200","push알림 성공",res));
    }

    @PutMapping("/agree")
    public ResponseEntity<?> agree(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal, @RequestBody NotificationEnableDto enable){
        boolean res = fcmService.updateEnableNotification(customUserPrincipal.getMemberId(),enable);
        return ResponseEntity.ok(new ApiResponse<>("200", "알림 동의 여부 수정 성공",res));
    }

    @GetMapping("/isAgree")
    public ResponseEntity<?> enabledCheck(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal){
        boolean enabled = fcmService.getNotificationEnabled(customUserPrincipal.getMemberId());
        NotificationEnableDto res = new NotificationEnableDto();
        res.setEnable(enabled);
        return ResponseEntity.ok(new ApiResponse<>("200","알림 동의 여부 조회 성공", res));
    }


}

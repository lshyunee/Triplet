package com.ssafy.triplet.sms.service;

import com.ssafy.triplet.sms.dto.request.SmsConfirmRequest;
import com.ssafy.triplet.sms.dto.request.SmsSendRequest;
import com.ssafy.triplet.sms.repository.SmsRepository;
import com.ssafy.triplet.sms.util.SmsCertificationUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SmsService {

    private final SmsCertificationUtil smsCertificationUtil;
    private final SmsRepository smsRepository;

    public void sendSms(SmsSendRequest sendRequest) {
        String phoneNumber = sendRequest.getPhoneNumber();
        // 6자리 인증 코드를 랜덤으로 생성
        String certificationNumber = Integer.toString((int)(Math.random() * (999999 - 100000 + 1)) + 100000);
        smsCertificationUtil.sendSMS(phoneNumber, certificationNumber); // SMS 인증 유틸리티를 사용하여 SMS 발송
        smsRepository.createSmsCertification(phoneNumber, certificationNumber); // 인증정보 redis 에 저장
    }

    public boolean verifySms(SmsConfirmRequest confirmRequest) {
        if (isVerified(confirmRequest.getPhoneNumber(), confirmRequest.getCertificationNumber())) {
            smsRepository.deleteSmsCertification(confirmRequest.getPhoneNumber());
            return true;
        }
        return false;
    }

    // 휴대폰번호에 대한 인증정보 존재 and 받은 인증코드와 저장된 인증코드가 일치
    private boolean isVerified(String phoneNumber, String certificationNumber) {
        return smsRepository.isExist(phoneNumber)
                && certificationNumber.equals(smsRepository.getSmsCertification(phoneNumber));
    }

}

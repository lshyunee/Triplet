package com.ssafy.triplet.sms.service;

import com.ssafy.triplet.sms.dto.request.SmsConfirmRequest;
import com.ssafy.triplet.sms.dto.request.SmsSendRequest;

public interface SmsService {

    void sendSms(SmsSendRequest sendRequest);

    boolean verifySms(SmsConfirmRequest confirmRequest);

}

package com.ssafy.triplet.sms.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class SmsSendRequest {

    @NotNull(message = "전화번호는 10~11자리의 숫자여야 합니다.")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "전화번호는 10~11자리의 숫자여야 합니다.")
    private String phoneNumber;

}

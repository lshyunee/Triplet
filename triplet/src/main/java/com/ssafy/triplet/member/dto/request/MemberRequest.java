package com.ssafy.triplet.member.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class MemberRequest {

    @Pattern(regexp = "^[a-zA-Z0-9]+$", message = "영문자와 숫자만 사용할 수 있습니다.")
    @Size(min = 5, max = 16, message = "길이는 5자에서 16자 사이여야 합니다.")
    private String memberId;

    @Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*()]+$", message = "영문자, 숫자, 특수문자(!@#$%^&*())만 사용할 수 있습니다.")
    @Size(min = 8, max = 15, message = "길이는 8자에서 15자 사이여야 합니다.")
    private String password;

    private String passwordConfirm;
    private String name;
    private String identificationNumber; // 주민번호: 생일 + 성별

    @Pattern(regexp = "^[0-9]{6}$", message = "6자리 숫자여야 합니다.")
    private String simplePassword;

    private String phoneNumber;

}

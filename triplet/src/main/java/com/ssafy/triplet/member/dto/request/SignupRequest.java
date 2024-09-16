package com.ssafy.triplet.member.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;


@Getter
public class SignupRequest {

    @NotNull
    @Pattern(regexp = "^[a-zA-Z0-9]{5,16}$")
    private String memberId;

    @NotNull
    @Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*()]{8,15}$")
    private String password;

    private String passwordConfirm;

    @NotBlank
    private String name;

    @NotNull
    @Pattern(regexp = "^[0-9]{7}$")
    private String identificationNumber; // 주민번호: 생일 + 성별 7자리 숫자

    @NotNull
    @Pattern(regexp = "^[0-9]{6}$")
    private String simplePassword;

    @NotNull
    @Pattern(regexp = "^[0-9]{10,11}$")
    private String phoneNumber;

}

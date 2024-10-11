package com.ssafy.triplet.member.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;


@Getter
public class SignupRequest {

    @NotNull(message = "아이디는 5~16자의 영문, 숫자입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9]{5,16}$", message = "아이디는 5~16자의 영문, 숫자입니다.")
    private String memberId;

    @NotNull(message = "비밀번호는 8~16자의 영문, 특수문자(!@#$%^&*()), 숫자입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*()]{8,15}$", message = "비밀번호는 8~16자의 영문, 특수문자(!@#$%^&*()), 숫자입니다.")
    private String password;

    private String passwordConfirm;

    @NotBlank(message = "이름은 비어있을 수 없습니다.")
    private String name;

    @NotNull(message = "주민등록번호는 7자리의 숫자입니다. (생년월일 + 성별)")
    @Pattern(regexp = "^[0-9]{7}$", message = "주민등록번호는 7자리의 숫자입니다. (생년월일 + 성별)")
    private String identificationNumber; // 주민번호: 생일 + 성별 7자리 숫자

    @NotNull(message = "휴대폰 번호는 10~11자의 숫자입니다.")
    @Pattern(regexp = "^[0-9]{10,11}$", message = "휴대폰 번호는 10~11자의 숫자입니다.")
    private String phoneNumber;

}

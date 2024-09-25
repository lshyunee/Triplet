package com.ssafy.triplet.member.dto.request;

import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class MemberUpdateRequest {

    @Pattern(regexp = "^[a-zA-Z0-9]{5,16}$", message = "아이디는 5~16자의 영문, 숫자입니다.")
    private String name;
    @Pattern(regexp = "^[0-9]{10,11}$", message = "휴대폰 번호는 10~11자의 숫자입니다.")
    private String phoneNumber;
    @Pattern(regexp = "^[0-9]{7}$", message = "주민등록번호는 7자리의 숫자입니다. (생년월일 + 성별)")
    private String identificationNumber;

}

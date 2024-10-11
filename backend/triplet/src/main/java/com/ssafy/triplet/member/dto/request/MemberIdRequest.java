package com.ssafy.triplet.member.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class MemberIdRequest {

    @NotNull(message = "아이디는 5~16자의 영문, 숫자입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9]{5,16}$", message = "아이디는 5~16자의 영문, 숫자입니다.")
    private String memberId;

}

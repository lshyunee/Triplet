package com.ssafy.triplet.member.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class SimplePasswordConfirmRequest {

    @NotNull(message = "간편 비밀번호는 6자리의 숫자입니다.")
    @Pattern(regexp = "^[0-9]{6}$", message = "간편 비밀번호는 6자리의 숫자입니다.") // 6자리 숫자
    private String simplePassword;

}

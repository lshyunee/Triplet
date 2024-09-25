package com.ssafy.triplet.member.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class PasswordUpdateRequest {

    private String password;
    @NotNull(message = "비밀번호는 8~16자의 영문, 특수문자(!@#$%^&*()), 숫자입니다.")
    @Pattern(regexp = "^[a-zA-Z0-9!@#$%^&*()]{8,15}$", message = "비밀번호는 8~16자의 영문, 특수문자(!@#$%^&*()), 숫자입니다.")
    private String newPassword;
    private String newPasswordConfirm;

}

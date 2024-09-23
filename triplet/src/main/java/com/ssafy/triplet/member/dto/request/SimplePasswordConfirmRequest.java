package com.ssafy.triplet.member.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class SimplePasswordConfirmRequest {

    @NotNull
    @Pattern(regexp = "^[0-9]{6}$") // 6자리 숫자
    private String simplePassword;

}

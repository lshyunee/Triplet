package com.ssafy.triplet.member.dto.request;

import lombok.Getter;

@Getter
public class PasswordUpdateRequest {

    private String password;
    private String newPassword;
    private String newPasswordConfirm;

}

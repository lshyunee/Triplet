package com.ssafy.triplet.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@AllArgsConstructor
public class MemberAuthDto {

    private String memberId; // username
    private String password;
    private String role;

    public MemberAuthDto(String memberId, String role) {
        this.memberId = memberId;
        this.role = role;
    }
}

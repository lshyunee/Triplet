package com.ssafy.triplet.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MemberAuthDto {

    private String memberId; // username
    private String role;

    public MemberAuthDto(String memberId, String role) {
        this.memberId = memberId;
        this.role = role;
    }
}

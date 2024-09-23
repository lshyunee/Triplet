package com.ssafy.triplet.member.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;

@Getter
public class MemberIdRequest {

    @NotNull
    @Pattern(regexp = "^[a-zA-Z0-9]{5,16}$")
    private String memberId;

}

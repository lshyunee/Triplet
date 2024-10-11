package com.ssafy.triplet.member.dto.response;

import lombok.*;

@Getter @Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberResponse {

    private String memberId;
    private String name;
    private String birth;
    private boolean gender;
    private String phoneNumber;

}

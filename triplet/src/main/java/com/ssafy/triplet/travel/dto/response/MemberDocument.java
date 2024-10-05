package com.ssafy.triplet.travel.dto.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@RequiredArgsConstructor
public class MemberDocument {
    private Long id;
    private int age;
    private int gender;
}

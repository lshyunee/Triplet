package com.ssafy.triplet.travel.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TravelShareRequest {
    private Long travelId;
    private int isShared;
    private int shareStatus;
}

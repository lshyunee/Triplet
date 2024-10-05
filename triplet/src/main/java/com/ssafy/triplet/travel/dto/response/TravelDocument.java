package com.ssafy.triplet.travel.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TravelDocument {
    private Long travelId;
    private int days;
    private String title;
    private String image;
    private int memberCount;
    private boolean status;
    private Long creatorId;
    private boolean isShared;
    private boolean shareStatus;
    private double totalBudget;
    private double totalBudgetWon;
    private String country;
}

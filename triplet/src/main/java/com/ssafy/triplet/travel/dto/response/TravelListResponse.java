package com.ssafy.triplet.travel.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Setter
@Getter
public class TravelListResponse {
    private Long travelId;
    private String title;
    private LocalDate startDate;
    private LocalDate endDate;
    private String image;
    private String countryName;
    private int countryId;
    private int memberCount;
    private double totalBudget;
    private Long folderId;
}

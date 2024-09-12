package com.ssafy.triplet.travel.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;

@Getter
@Builder
public class TravelRegisterRequest {
    private int countryId;
    private String title;
    private Date startDate;
    private Date endDate;
    private MultipartFile image;
    private int memberCount;
    private Long creatorId;
    private double totalBudget;
}

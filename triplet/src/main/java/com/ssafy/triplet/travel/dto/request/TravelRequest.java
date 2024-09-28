package com.ssafy.triplet.travel.dto.request;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class TravelRequest {
    private Long travelId;
    private Long creatorId;
    private int country;
    private LocalDate startDate;
    private LocalDate endDate;
    private String title;
    private MultipartFile image;
    private int memberCount;
    private double totalBudget;
    private double airportCost;
    private double totalBudgetWon;
    private List<BudgetDTO> budgets;

    @Getter
    @Setter
    public static class BudgetDTO {
        private int categoryId;
        private double budget;
        private double budgetWon;
    }
}

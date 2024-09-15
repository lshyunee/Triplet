package com.ssafy.triplet.travel.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class TravelResponse {
    private Long travelId;
    private String inviteCode;
    private String country;
    private int countryId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String title;
    private String image;
    private Long creatorId;
    private int memberCount;
    private double totalBudget;
    private double airportCost;
    private double totalBudgetWon;
    private List<BudgetDTO> budgets;

    @Getter
    @Setter
    public static class BudgetDTO {
        private int categoryId;
        private String categoryName;
        private double budget;
        private double budgetWon;

        public BudgetDTO(int categoryId, String categoryName, double budget, double budgetWon) {
            this.categoryId = categoryId;
            this.categoryName = categoryName;
            this.budget = budget;
            this.budgetWon = budgetWon;
        }
    }
}

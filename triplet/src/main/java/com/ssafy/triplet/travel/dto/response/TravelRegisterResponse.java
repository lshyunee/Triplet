package com.ssafy.triplet.travel.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class TravelRegisterResponse {
    private String walletAccountNumber;
    private String inviteCode;
    private String country;
    private LocalDate startDate;
    private LocalDate endDate;
    private String title;
    private String image;
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

        public BudgetDTO(int categoryId, double budget, double budgetWon) {
            this.categoryId = categoryId;
            this.budget = budget;
            this.budgetWon = budgetWon;
        }
    }
}

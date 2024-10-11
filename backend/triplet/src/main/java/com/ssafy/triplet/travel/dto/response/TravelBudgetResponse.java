package com.ssafy.triplet.travel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TravelBudgetResponse {
    private int categoryId;
    private String categoryName;
    private double categoryBudget;
    private double usedBudget;
    private double fiftyBudget;
    private double eightyBudget;
    private double budgetWon;
}

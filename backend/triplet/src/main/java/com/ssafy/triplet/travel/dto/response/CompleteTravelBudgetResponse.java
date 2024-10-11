package com.ssafy.triplet.travel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CompleteTravelBudgetResponse {
    private int categoryId;
    private String categoryName;
    private double used;
}

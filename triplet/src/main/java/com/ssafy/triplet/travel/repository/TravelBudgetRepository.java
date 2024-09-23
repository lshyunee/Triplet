package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.dto.response.TravelBudgetResponse;
import com.ssafy.triplet.travel.entity.Travel;
import com.ssafy.triplet.travel.entity.TravelBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelBudgetRepository extends JpaRepository<TravelBudget, Long> {
    List<TravelBudget> findByTravel(Travel travel);

    @Query("SELECT new com.ssafy.triplet.travel.dto.response.TravelBudgetResponse(tb.category.categoryId, tb.category.categoryName, tb.categoryBudget, tb.usedBudget, tb.fiftyBudget, tb.eightyBudget, tb.budgetWon) " +
            "FROM TravelBudget tb WHERE tb.travel = :travel")
    List<TravelBudgetResponse> findBudgetResponseByTravel(Travel travel);
}

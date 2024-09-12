package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.entity.Travel;
import com.ssafy.triplet.travel.entity.TravelBudget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TravelBudgetRepository extends JpaRepository<TravelBudget, Long> {
    List<TravelBudget> findByTravel(Travel travel);
}

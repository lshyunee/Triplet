package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.entity.TravelTransactionList;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TravelTransactionListRepository extends JpaRepository<TravelTransactionList, Long> {
    List<TravelTransactionList> findByTravelIdOrderByTransactionDateDesc(Long travelId);
    TravelTransactionList getTransactionListById(Long id);
}

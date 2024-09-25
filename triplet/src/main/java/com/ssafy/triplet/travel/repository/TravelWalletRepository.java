package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.entity.Travel;
import com.ssafy.triplet.travel.entity.TravelWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface TravelWalletRepository extends JpaRepository<TravelWallet, Long> {

    @Modifying
    @Transactional
    @Query("UPDATE TravelWallet t SET t.balance = :amount WHERE t.travelId.id = :travelId")
    void rechargeTravelWallet(Long travelId, double amount);

    @Query("SELECT t.balance FROM TravelWallet t WHERE t.travelId = :travel")
    double findBalanceByTravel(Travel travel);
}

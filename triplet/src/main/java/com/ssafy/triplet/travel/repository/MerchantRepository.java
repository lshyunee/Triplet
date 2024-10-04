package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.entity.Merchant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface MerchantRepository extends JpaRepository<Merchant, Long> {
    @Query("SELECT m.merchantName FROM Merchant m WHERE m.id = :id")
    String findMerchantNameById(Long id);


    @Query("SELECT m.currency FROM Merchant m WHERE m.id = :id")
    String findMerchantCurrencyCodeById(Long id);



}

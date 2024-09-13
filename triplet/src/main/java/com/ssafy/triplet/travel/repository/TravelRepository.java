package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.entity.Travel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TravelRepository extends JpaRepository<Travel, Long> {

    @Query("SELECT t FROM Travel t JOIN t.travelMembers tm WHERE tm.member.id = :userId AND (t.startDate <= :today AND t.endDate >= :today)")
    List<Travel> findByUserIdInTravelMembers(@Param("userId") Long userId, @Param("today") LocalDate today);
}
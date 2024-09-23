package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.dto.response.TravelListResponse;
import com.ssafy.triplet.travel.dto.response.TravelResponse;
import com.ssafy.triplet.travel.entity.Travel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TravelRepository extends JpaRepository<Travel, Long> {

    @Query("SELECT t.creatorId FROM Travel t WHERE t.id = :travelId")
    Long findCreatorIdByTravelId(@Param("travelId") Long travelId);

    @Query("SELECT t FROM Travel t JOIN t.travelMembers tm WHERE tm.member.id = :userId AND (t.startDate <= :today AND t.endDate >= :today) ORDER BY t.startDate ASC")
    Travel findOngoingTravelByUserId(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT t FROM Travel t JOIN t.travelMembers tm WHERE tm.member.id = :userId AND (t.endDate < :today) ORDER BY t.startDate ASC")
    List<Travel> findCompletedTravelsByUserId(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT t FROM Travel t JOIN t.travelMembers tm WHERE tm.member.id = :userId AND (t.startDate > :today) ORDER BY t.startDate ASC")
    List<Travel> findUpcomingTravelsByUserId(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT t.id FROM Travel t WHERE t.inviteCode = :inviteCode")
    Long findTravelIdByInviteCode(@Param("inviteCode") String inviteCode);
}
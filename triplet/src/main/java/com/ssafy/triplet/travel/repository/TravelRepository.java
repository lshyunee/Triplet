package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.dto.response.TravelFeedListResponse;
import com.ssafy.triplet.travel.dto.response.TravelListResponse;
import com.ssafy.triplet.travel.entity.Travel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TravelRepository extends JpaRepository<Travel, Long>, JpaSpecificationExecutor<Travel> {

    @Query("SELECT t.creatorId FROM Travel t WHERE t.id = :travelId")
    Long findCreatorIdByTravelId(@Param("travelId") Long travelId);

    @Query("SELECT t FROM Travel t JOIN t.travelMembers tm WHERE tm.member.id = :userId AND (t.startDate <= :today AND t.endDate >= :today) ORDER BY t.startDate ASC")
    Travel findOngoingTravelByUserId(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT t FROM Travel t JOIN t.travelMembers tm WHERE tm.member.id = :userId AND (t.endDate < :today) ORDER BY t.startDate ASC")
    List<Travel> findCompletedTravelsByUserId(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT t FROM Travel t JOIN t.travelMembers tm WHERE tm.member.id = :userId AND (t.startDate > :today) ORDER BY t.startDate ASC")
    List<Travel> findUpcomingTravelsByUserId(@Param("userId") Long userId, @Param("today") LocalDate today);

    @Query("SELECT t FROM Travel t JOIN t.travelMembers tm WHERE tm.member.id = :userId")
    List<Travel> findAllTravelByUserId(Long userId);

    @Query("SELECT t FROM Travel t JOIN t.travelMembers tm WHERE t.isShared = true AND (:userId IS NULL OR tm.member.id != :userId) ORDER BY t.startDate DESC")
    Page<Travel> findAllTravel(Long userId, Pageable pageable);

    @Query("SELECT t FROM Travel t WHERE t.inviteCode = :inviteCode")
    Travel findTravelIdByInviteCode(@Param("inviteCode") String inviteCode);

    @Modifying
    @Query("UPDATE Travel t SET t.status = :status WHERE t.id = :travelId")
    void updateStatusByTravelId(@Param("travelId") Long travelId, @Param("status") boolean status);

    @Query("SELECT t.id FROM Travel t WHERE t.endDate = :today")
    List<Long> findTravelIdByEndDate(LocalDate today);
}
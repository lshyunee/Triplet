package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.entity.Travel;
import com.ssafy.triplet.travel.entity.TravelMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface TravelMemberRepository extends JpaRepository<TravelMember, Long> {
    Optional<TravelMember> findByMemberIdAndTravelId(Long memberId, Long travelId);

    @Modifying
    @Transactional
    void deleteByMemberIdAndTravelId(Long memberId, Long travelId);
}

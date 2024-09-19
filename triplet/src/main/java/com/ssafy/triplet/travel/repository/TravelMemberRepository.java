package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.entity.TravelMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TravelMemberRepository extends JpaRepository<TravelMember, Long> {

}

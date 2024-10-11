package com.ssafy.triplet.member.repository;

import com.ssafy.triplet.member.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findByMemberId(String memberId);

    @Query("SELECT m.id FROM Member m WHERE m.memberId = :memberId")
    Long findIdByMemberId(String memberId);

    boolean existsByPhoneNumber(String phoneNumber);

    @Query("SELECT m FROM Member m WHERE m.id = :id")
    Member findByMemberLongId(Long id);
}

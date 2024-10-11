package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.travel.entity.GroupAccountStake;
import com.ssafy.triplet.travel.entity.TravelWallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface GroupAccountStakeRepostory extends JpaRepository<GroupAccountStake, Long> {

    @Query("SELECT g.totalMoney FROM GroupAccountStake g WHERE g.id = :groupAccountId")
    double findTotalMoneyByGroupAccountId(Long groupAccountId);

    @Query("SELECT g.id FROM GroupAccountStake g WHERE g.travelWallet = :travelWalletId AND g.member = :memberId")
    Long findIdByTravelWalletIdAndMemberId(TravelWallet travelWalletId, Member memberId);

    @Modifying
    @Query("UPDATE GroupAccountStake g SET g.totalMoney = :cost WHERE g.travelWallet = :travelWallet AND g.member = :member")
    void updateTotalMoneyByTravelAndMember(double cost, TravelWallet travelWallet, Member member);

    @Query("SELECT g.member.id, g.totalMoney FROM GroupAccountStake g WHERE g.travelWallet.id = :travelWalletId")
    List<Object[]> findMemberAndTotalMoneyByTravelId(@Param("travelWalletId") Long travelWalletId);

    @Modifying
    @Transactional
    @Query("DELETE GroupAccountStake g WHERE g.travelWallet = :travelWallet AND g.member.id = :member")
    void deleteGroupAccountStake(TravelWallet travelWallet, Long member);
}

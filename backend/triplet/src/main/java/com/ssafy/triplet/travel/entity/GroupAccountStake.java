package com.ssafy.triplet.travel.entity;

import com.ssafy.triplet.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "group_account_stake")
public class GroupAccountStake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "total_money")
    private Double totalMoney;

    @ManyToOne
    @JoinColumn(name = "travel_wallet_id", referencedColumnName = "id", nullable = false)
    private TravelWallet travelWallet;

    @ManyToOne
    @JoinColumn(name = "member_id", referencedColumnName = "id", nullable = false)
    private Member member;

}

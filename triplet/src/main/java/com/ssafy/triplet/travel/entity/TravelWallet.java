package com.ssafy.triplet.travel.entity;

import com.ssafy.triplet.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "travel_wallet")
public class TravelWallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "wallet_number", nullable = false)
    private String walletNumber;

    @Column(name = "balance", nullable = false)
    private Double balance;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "bank_name", nullable = false)
    private String bankName;

    @Column(name = "bank_code", nullable = false)
    private String bankCode;

    @Column(name = "share", nullable = false)
    private Boolean share;

    @ManyToOne
    @JoinColumn(name = "creator_id", referencedColumnName = "id", nullable = false)
    private Member creatorId;

    @OneToOne
    @JoinColumn(name = "travel_id", referencedColumnName = "id", nullable = false)
    private Travel travel;
}

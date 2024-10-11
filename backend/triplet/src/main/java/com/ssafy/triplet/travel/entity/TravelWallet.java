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

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "balance")
    private Double balance = 0.0;

    @Column(name = "bank_name")
    private String bankName = "바나나은행";

    @Column(name = "bank_code")
    private String bankCode = "124";

    @Column(name = "share")
    private Boolean share = false;

    @ManyToOne
    @JoinColumn(name = "creator_id", referencedColumnName = "id", nullable = false)
    private Member creatorId;

    @OneToOne
    @JoinColumn(name = "travel_id", referencedColumnName = "id", nullable = false)
    private Travel travelId;
}

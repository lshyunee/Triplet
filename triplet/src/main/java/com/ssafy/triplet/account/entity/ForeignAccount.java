package com.ssafy.triplet.account.entity;

import com.ssafy.triplet.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter @Setter
@NoArgsConstructor
public class ForeignAccount {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;
    private String bankCode = "124";
    private String bankName = "바나나은행";
    private String accountNumber;
    private String accountName;
    private String accountType = "OVERSEAS"; // 외화
    private String currency;
    private LocalDateTime accountCreatedDate;
    private LocalDateTime accountExpiryDate;
    private double accountBalance = 0;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "foreignAccount")
    private List<ForeignTransactionList> foreignTransactionList = new ArrayList<>();

    public ForeignAccount(String accountNumber, String accountName, String currency, LocalDateTime accountCreatedDate, LocalDateTime accountExpiryDate) {
        this.accountNumber = accountNumber;
        this.accountName = accountName;
        this.currency = currency;
        this.accountCreatedDate = accountCreatedDate;
        this.accountExpiryDate = accountExpiryDate;
    }
}


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
public class KrwAccount {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;
    private String bankCode = "124";
    private String bankName = "바나나은행";
    @Column(unique = true)
    private String accountNumber;
    private String accountName = "내 통장";
    private String accountType = "DOMESTIC";
    private String currency = "KRW";
    private LocalDateTime accountCreatedDate;
    private LocalDateTime accountExpiryDate;
    private double accountBalance = 0;

    @OneToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "krwAccount")
    private List<TransactionList> transactionList = new ArrayList<>();

    public KrwAccount(String accountNumber, LocalDateTime accountCreatedDate, LocalDateTime accountExpiryDate) {
        this.accountNumber = accountNumber;
        this.accountCreatedDate = accountCreatedDate;
        this.accountExpiryDate = accountExpiryDate;
    }

    public void createTransaction(TransactionList transaction) {
        transactionList.add(transaction);
        transaction.setKrwAccount(this);
    }
}

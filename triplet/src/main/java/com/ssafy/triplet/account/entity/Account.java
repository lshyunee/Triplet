package com.ssafy.triplet.account.entity;

import com.ssafy.triplet.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long accountId;
    @Builder.Default
    private String bankCode = "124";
    @Builder.Default
    private String bankName = "바나나은행";
    @Column(unique = true)
    private String accountNumber;
    private String accountName;
    private String accountType;
    private String currency;
    private LocalDateTime accountCreatedDate;
    private LocalDateTime accountExpiryDate;
    @Builder.Default
    private double accountBalance = 0;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "account")
    private List<TransactionList> transactionList = new ArrayList<>();

    public Account(String accountNumber, LocalDateTime accountCreatedDate, LocalDateTime accountExpiryDate) {
        this.accountNumber = accountNumber;
        this.accountCreatedDate = accountCreatedDate;
        this.accountExpiryDate = accountExpiryDate;
    }

    public void createTransaction(TransactionList transaction) {
        transactionList.add(transaction);
        transaction.setAccount(this);
    }

    @PreRemove // 삭제 시 거래내역과 분리
    public void preRemove() {
        transactionList.forEach(transaction -> transaction.setAccount(null));
    }

}

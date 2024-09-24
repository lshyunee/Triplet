package com.ssafy.triplet.account.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Builder
@Getter @Setter
@AllArgsConstructor
@NoArgsConstructor
public class ForeignTransactionList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @CreationTimestamp
    private LocalDateTime transactionDate;
    private int transactionType; // 1: 입금, 2: 출금
    private String transactionTypeName;
    private String transactionAccountNumber;
    private double price;
    private double transactionAfterBalance;
    private String transactionName;

    @ManyToOne
    @JoinColumn(name = "foreign_account_id")
    private ForeignAccount foreignAccount;

}

package com.ssafy.triplet.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "travel_transaction_list")
public class TravelTransactionList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "transaction_date", nullable = false)
    private LocalDateTime transactionDate;

    @Column(name = "balance", nullable = false)
    private double balance;

    @Column(name="transaction_name",nullable = false)
    private String transactionName;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    private Category category;

    @ManyToOne
    @JoinColumn(name = "travel_id", referencedColumnName = "id", nullable = false)
    private Travel travel;
}

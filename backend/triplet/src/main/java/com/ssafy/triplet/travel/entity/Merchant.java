package com.ssafy.triplet.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "merchant")
public class Merchant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "merchant_name", nullable = false)
    private String merchantName;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "currency", nullable = false)
    private String currency;

    @Column(name = "account_number", nullable = false)
    private String accountNumber;

    @OneToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id", nullable = false)
    private Category category;
}

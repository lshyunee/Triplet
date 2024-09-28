package com.ssafy.triplet.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "travel_budget")
public class TravelBudget {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "category_budget", nullable = false)
    private double categoryBudget;

    @Column(name = "used_budget", nullable = false)
    private double usedBudget = 0.0;

    @Column(name = "fifty_budget")
    private Double fiftyBudget;

    @Column(name = "eighty_budget")
    private Double eightyBudget;

    @ManyToOne
    @JoinColumn(name = "travel_id", referencedColumnName = "id", nullable = false)
    private Travel travel;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id", nullable = false)
    private Category category;

    @Column(name = "budget_won", nullable = false)
    private double budgetWon;
}

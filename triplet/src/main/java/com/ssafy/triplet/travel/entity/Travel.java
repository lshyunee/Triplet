package com.ssafy.triplet.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name="travel")
public class Travel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "image", nullable = true)
    private String image = "https://github.com/user-attachments/assets/5124d789-1953-4437-a0a5-ca0c2e636dba";

    @Column(name = "invite_code")
    private String inviteCode;

    @Column(name = "member_count", nullable = false)
    private int memberCount;

    @Column(name = "status")
    private boolean status;

    @Column(name = "creator_id", nullable = false)
    private Long creatorId;

    @Column(name = "is_shared")
    private boolean isShared;

    @Column(name = "share_status")
    private boolean shareStatus;

    @Column(name = "total_budget", nullable = false)
    private double totalBudget;

    @Column(name = "airport_cost", nullable = false)
    private double airportCost;

    @Column(name = "total_budget_won", nullable = false)
    private double totalBudgetWon;

    @ManyToOne
    @JoinColumn(name = "country_id", referencedColumnName = "id", nullable = false)
    Country country;

    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL)
    private List<TravelBudget> travelBudgets;

}

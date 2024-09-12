package com.ssafy.triplet.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
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
    private Date staratDate;

    @Column(name = "end_date", nullable = false)
    private Date endDate;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "image")
    private String image;

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

    @ManyToOne
    @JoinColumn(name = "country_id", referencedColumnName = "id", nullable = false)
    Country country;

    @OneToMany(mappedBy = "travel", cascade = CascadeType.ALL)
    private List<TravelBudget> travelBudgets;

}

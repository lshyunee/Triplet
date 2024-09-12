package com.ssafy.triplet.travel.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "travel_keyword")
public class TravelKeyword {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "travel_id", referencedColumnName = "id", nullable = false)
    private Travel travel;

    @ManyToOne
    @JoinColumn(name = "keyword_id", referencedColumnName = "id", nullable = false)
    private Keyword keyword;
}

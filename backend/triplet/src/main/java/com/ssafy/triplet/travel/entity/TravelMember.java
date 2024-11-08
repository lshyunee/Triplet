package com.ssafy.triplet.travel.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.ssafy.triplet.member.entity.Member;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "travel_member")
public class TravelMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "travel_member_id")
    private Long travelMemberId;

    @ManyToOne
    @JoinColumn(name = "member_id", referencedColumnName = "id", nullable = false)
    private Member member;

    @ManyToOne
    @JoinColumn(name = "travel_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private Travel travel;
}
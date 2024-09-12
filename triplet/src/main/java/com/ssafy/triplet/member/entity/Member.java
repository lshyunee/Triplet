package com.ssafy.triplet.member.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter @Setter
public class Member {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String memberId; // 식별자
    private String password;
    private String name;
    private LocalDate birth;
    private Boolean gender;
    private String simplePassword;
    private String phoneNumber;
    private String role;

}

package com.ssafy.triplet.member.entity;

import com.ssafy.triplet.account.entity.ForeignAccount;
import com.ssafy.triplet.account.entity.KrwAccount;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;


@Entity
@Builder
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Member {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String memberId; // 식별자
    private String password;
    private String name;
    private String birth;
    private Boolean gender;
    private String simplePassword;
    private String phoneNumber;
    private String role;

    @OneToOne(mappedBy = "member")
    private KrwAccount krwAccount;

    @OneToMany(mappedBy = "member")
    private List<ForeignAccount> foreignAccounts;

    public void createMyKrwAccount(KrwAccount krwAccount) {
        this.krwAccount = krwAccount;
        krwAccount.setMember(this);
    }

    public void createMyForeignAccount(ForeignAccount foreignAccount) {
        this.foreignAccounts.add(foreignAccount);
        foreignAccount.setMember(this);
    }

}

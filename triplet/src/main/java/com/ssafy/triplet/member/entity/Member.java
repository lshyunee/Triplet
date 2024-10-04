package com.ssafy.triplet.member.entity;

import com.ssafy.triplet.account.entity.Account;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
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
    @Column(unique = true)
    private String phoneNumber;
    private String role;

    @OneToOne
    @JoinColumn(name = "krw_account_id")
    private Account krwAccount;

    @OneToMany(mappedBy = "member")
    @Builder.Default
    private List<Account> foreignAccounts = new ArrayList<>();

    public void createMyKrwAccount(Account account) {
        this.krwAccount = account;
        account.setMember(this);
    }

    public void createMyForeignAccount(Account account) {
        this.foreignAccounts.add(account);
        account.setMember(this);
    }

}

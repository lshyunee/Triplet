package com.ssafy.triplet.account.repository;

import com.ssafy.triplet.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {

    boolean existsByAccountNumber(String accountNumber);

    boolean existsByAccountId(Long accountId);

    Account findByAccountNumber(String accountNumber);

    @Query("select a from Account a join fetch a.member m " +
            "where m.memberId = :memberId and a.accountType = 'OVERSEAS' order by a.currency asc")
    List<Account> findMyForeignAccounts(String memberId);
}

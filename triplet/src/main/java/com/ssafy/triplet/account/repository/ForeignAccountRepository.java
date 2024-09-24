package com.ssafy.triplet.account.repository;

import com.ssafy.triplet.account.entity.ForeignAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ForeignAccountRepository extends JpaRepository<ForeignAccount, Long> {

    @Query("select fa from ForeignAccount fa join fetch fa.member m where m.memberId = :memberId")
    List<ForeignAccount> findMyForeignAccounts(String memberId);

    boolean existsByAccountId(Long accountId);

}

package com.ssafy.triplet.account.repository;

import com.ssafy.triplet.account.entity.KrwAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KrwAccountRepository extends JpaRepository<KrwAccount, Long> {

    boolean existsByAccountNumber(String accountNumber);

    boolean existsByAccountId(Long accountId);

}

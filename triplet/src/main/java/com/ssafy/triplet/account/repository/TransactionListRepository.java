package com.ssafy.triplet.account.repository;

import com.ssafy.triplet.account.entity.TransactionList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransactionListRepository extends JpaRepository<TransactionList, Long> {

    @Query("select tl from TransactionList tl join fetch tl.account a " +
            "where a.accountId = :accountId")
    List<TransactionList> findByAccountId(Long accountId);

}

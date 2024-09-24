package com.ssafy.triplet.account.repository;

import com.ssafy.triplet.account.entity.ForeignTransactionList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ForeignTransactionListRepository extends JpaRepository<ForeignTransactionList, Long> {

    @Query("select fl from ForeignTransactionList fl join fetch fl.foreignAccount fa " +
            "where fa.accountId = :accountId")
    List<ForeignTransactionList> findByForeignAccountId(Long accountId);

}

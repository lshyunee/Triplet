package com.ssafy.triplet.account.repository;

import com.ssafy.triplet.account.dto.response.AccountRechargeResponse;
import com.ssafy.triplet.account.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {

    boolean existsByAccountNumber(String accountNumber);

    boolean existsByAccountId(Long accountId);

    Account findByAccountNumber(String accountNumber);

    @Query("select a from Account  a join fetch a.member m " +
            "where m.memberId = :memberId and a.currency = :currency")
    Account findForeignByCurrency(String memberId, String currency);

    @Query("select a from Account a join fetch a.member m " +
            "where m.memberId = :memberId and a.accountType = 'OVERSEAS' order by a.currency asc")
    List<Account> findMyForeignAccounts(String memberId);

    @Query("SELECT new com.ssafy.triplet.account.dto.response.AccountRechargeResponse(fa.accountNumber, fa.accountBalance) " +
            "FROM Account fa WHERE fa.member.id = :memberId AND fa.currency = :currency")
    AccountRechargeResponse findAccountNumberByMemberIdAndCurrency(@Param("memberId") Long memberId, @Param("currency") String currency);

    @Modifying
    @Query("UPDATE Account fa SET fa.accountBalance = :accountBalance WHERE fa.accountNumber = :accountNumber")
    void rechargeTravelAccount(@Param("accountNumber") String accountNumber, @Param("accountBalance") double accountBalance);

    @Query("SELECT a FROM Account a JOIN FETCH a.member WHERE a.member.id = :memberId AND a.currency = :currency")
    Account findByMemberIdAndCurrencyWithMember(@Param("memberId") Long memberId, @Param("currency") String currency);


}

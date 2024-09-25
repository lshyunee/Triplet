package com.ssafy.triplet.account.repository;

import com.ssafy.triplet.account.dto.response.ForeignAccountRechargeResponse;
import com.ssafy.triplet.account.entity.ForeignAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ForeignAccountRepository extends JpaRepository<ForeignAccount, Long> {

    @Query("select fa from ForeignAccount fa join fetch fa.member m where m.memberId = :memberId")
    List<ForeignAccount> findMyForeignAccounts(String memberId);

    boolean existsByAccountId(Long accountId);

    @Query("SELECT new com.ssafy.triplet.account.dto.response.ForeignAccountRechargeResponse(fa.accountNumber, fa.accountBalance) " +
            "FROM ForeignAccount fa WHERE fa.member.id = :memberId AND fa.currency = :currency")
    ForeignAccountRechargeResponse findAccountNumberByMemberIdAndCurrency(@Param("memberId") Long memberId, @Param("currency") String currency);

    @Modifying
    @Query("UPDATE ForeignAccount fa SET fa.accountBalance = :accountBalance WHERE fa.accountNumber = :accountNumber")
    void rechargeTravelAccount(@Param("accountNumber") String accountNumber, @Param("accountBalance") double accountBalance);
}

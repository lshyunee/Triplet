package com.ssafy.triplet.travel.service;

import com.ssafy.triplet.account.dto.response.AccountRechargeResponse;
import com.ssafy.triplet.account.service.AccountService;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import com.ssafy.triplet.travel.dto.request.TravelWalletRechargeRequest;
import com.ssafy.triplet.travel.dto.response.TransactionListResponse;
import com.ssafy.triplet.travel.dto.response.TravelWalletResponse;
import com.ssafy.triplet.travel.entity.*;
import com.ssafy.triplet.travel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TravelWalletService {
    private final TravelWalletRepository travelWalletRepository;
    private final MemberRepository memberRepository;
    private final TravelRepository travelRepository;
    private final AccountService accountService;
    private final TravelTransactionListRepository transactionListRepository;
    private final CategoryRepository categoryRepository;
    private final MerchantRepository merchantRepository;
    private final GroupAccountStakeRepostory groupAccountStakeRepostory;

    @Transactional
    public void makeTravelWallet(Travel savedTravel, Long userId) {
        TravelWallet travelWallet = new TravelWallet();
        travelWallet.setTravelId(savedTravel);
        String travelId = savedTravel.getId() + "";
        String walletNumber = "124" + travelId;
        travelWallet.setWalletNumber(walletNumber);
        travelWallet.setCurrency(savedTravel.getCountry().getCurrency());
        Member member = memberRepository.findById(userId).orElseThrow(() -> new CustomException("M0010", "존재하지 않는 회원입니다."));
        travelWallet.setCreatorId(member);
        travelWalletRepository.save(travelWallet);
    }

    @Transactional
    public TransactionListResponse rechargeTravelWallet(Long userId, TravelWalletRechargeRequest request, int category) {
        return processWalletTransaction(userId, request, category);
    }

    @Transactional
    public TransactionListResponse returnTravelWallet(Long userId, TravelWalletRechargeRequest request, int category) {
        return processWalletTransaction(userId, request, category);
    }

    private TransactionListResponse processWalletTransaction(Long userId, TravelWalletRechargeRequest request, int category) {
        Travel travel = findTravelById(request.getTravelId());
        AccountRechargeResponse response = findAccountBalanceForRecharge(userId, travel.getCountry().getCurrency());
        double balanceTravelWallet = travelWalletRepository.findBalanceByTravel(request.getTravelId());
        double updatedAccountBalance;
        double updatedWalletBalance;
        double updateGroupAccountStake;
        TravelWallet travelWallet = travelWalletRepository.findByTravelId(travel);
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new CustomException("M0010", "존재하지 않는 회원입니다."));
        Long groupAccountId = groupAccountStakeRepostory.findIdByTravelWalletIdAndMemberId(travelWallet, member);
        if (category == 7) {    // 충전
            if (response.getAccountBalance() < request.getChargeCost()) {
                throw new CustomException("A0006", "계좌 잔액이 부족하여 거래가 실패했습니다.");
            }
            updatedAccountBalance = response.getAccountBalance() - request.getChargeCost();
            updatedWalletBalance = balanceTravelWallet + request.getChargeCost();
            updateGroupAccountStake = request.getChargeCost() + groupAccountStakeRepostory.findTotalMoneyByGroupAccountId(groupAccountId);
            groupAccountStakeRepostory.updateTotalMoneyByTravelAndMember(updateGroupAccountStake, travelWallet, member);

        } else {    // 반환
            if (balanceTravelWallet < request.getChargeCost()) {
                throw new CustomException("A0006", "계좌 잔액이 부족하여 거래가 실패했습니다.");
            }
            updatedAccountBalance = response.getAccountBalance() + request.getChargeCost();
            updatedWalletBalance = balanceTravelWallet - request.getChargeCost();
            updateGroupAccountStake = groupAccountStakeRepostory.findTotalMoneyByGroupAccountId(groupAccountId) - request.getChargeCost();
            groupAccountStakeRepostory.updateTotalMoneyByTravelAndMember(updateGroupAccountStake, travelWallet, member);
        }
        accountService.rechargeForTravelAccount(response.getAccountNumber(), updatedAccountBalance);
        travelWalletRepository.rechargeTravelWallet(request.getTravelId(), updatedWalletBalance);
        return addRechargeForTransactionList(travel, category, updatedWalletBalance, request,member.getName());
    }

    private Travel findTravelById(Long travelId) {
        return travelRepository.findById(travelId)
                .orElseThrow(() -> new CustomException("T0004", "여행이 존재하지 않습니다."));
    }

    private AccountRechargeResponse findAccountBalanceForRecharge(Long userId, String currency) {
        return accountService.findAccountForRecharge(userId, currency);
    }


    @Transactional
    public TransactionListResponse addRechargeForTransactionList(Travel travel, int categoryId, double balanceTravelWallet, TravelWalletRechargeRequest request, String name) {
        TravelTransactionList list = new TravelTransactionList();
        list.setTravel(travel);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CustomException("A0009", "카테고리 ID가 유효하지 않습니다."));
        list.setCategory(category);
        list.setPrice(request.getChargeCost());
        list.setBalance(balanceTravelWallet);
        list.setTransactionDate(request.getTransactionDate());
        list.setTransactionName(name);
        return convertToTransactionListResponse(transactionListRepository.save(list));
    }

    public List<TransactionListResponse> getTransactionList(Long travelId) {
        if (!travelRepository.existsById(travelId)) {
            throw new CustomException("T0004", "여행이 존재하지 않습니다.");
        }
        List<TravelTransactionList> trList = transactionListRepository.findByTravelIdOrderByTransactionDateDesc(travelId);
        List<TransactionListResponse> transactionListResponseList = new ArrayList<>();
        for (TravelTransactionList travelTransactionList : trList) {
            transactionListResponseList.add(convertToTransactionListResponse(travelTransactionList));
        }
        return transactionListResponseList;
    }

    @Transactional
    public TransactionListResponse modifyTransaction(Long transactionId, int categoryId) {
        if (!transactionListRepository.existsById(transactionId)) {
            throw new CustomException("A0004", "거래 고유 번호가 유효하지 않습니다.");
        }
        TravelTransactionList transaction = transactionListRepository.getTransactionListById(transactionId);
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new CustomException("A0009", "카테고리 ID가 유효하지 않습니다."));
        transaction.setCategory(category);
        TravelTransactionList updatedTransaction = transactionListRepository.save(transaction);
        return convertToTransactionListResponse(updatedTransaction);
    }

    public TravelWalletResponse getTravelWallet(Long travelId) {
        Travel travel = findTravelById(travelId);
        TravelWalletResponse response = new TravelWalletResponse();
        response.setCurrency(travel.getCountry().getCurrency());
        response.setShare(travel.isShareStatus());
        response.setBalance(travelWalletRepository.findBalanceByTravel(travelId));
        return response;
    }


    // 여행 지출 내역
    private TransactionListResponse convertToTransactionListResponse(TravelTransactionList travelTransactionList) {
        TransactionListResponse response = new TransactionListResponse();
        response.setTransactionId(travelTransactionList.getId());
        response.setPrice(travelTransactionList.getPrice());
        response.setTransactionDate(travelTransactionList.getTransactionDate());
        response.setCategoryName(categoryRepository.findCategoryNameByCategoryId(travelTransactionList.getCategory().getCategoryId()));
        response.setCategoryId(travelTransactionList.getCategory().getCategoryId());
        response.setMerchantName(travelTransactionList.getTransactionName());
        response.setTravelId(travelTransactionList.getTravel().getId());
        response.setBalance(travelTransactionList.getBalance());
        return response;
    }
}

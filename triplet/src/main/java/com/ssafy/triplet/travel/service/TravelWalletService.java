package com.ssafy.triplet.travel.service;

import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import com.ssafy.triplet.travel.dto.request.TravelWalletRechargeRequest;
import com.ssafy.triplet.travel.entity.Travel;
import com.ssafy.triplet.travel.entity.TravelWallet;
import com.ssafy.triplet.travel.repository.TravelRepository;
import com.ssafy.triplet.travel.repository.TravelWalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TravelWalletService {
    private final TravelWalletRepository travelWalletRepository;
    private final MemberRepository memberRepository;
    private final TravelRepository travelRepository;

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
    public void rechargeTravelWallet(Long userId, TravelWalletRechargeRequest request) {
        Travel travel = travelRepository.findById(request.getTravelId()).orElseThrow(() -> new CustomException("T0004", "여행이 존재하지 않습니다."));
        String currency = travel.getCountry().getCurrency();



    }
}

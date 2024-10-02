package com.ssafy.triplet.payment.service;

import com.ssafy.triplet.travel.entity.Merchant;
import com.ssafy.triplet.travel.repository.MerchantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final MerchantRepository merchantRepository;

    public Merchant getMerchantById(Long id) {

        return merchantRepository.findById(id).orElse(null);
    }


}

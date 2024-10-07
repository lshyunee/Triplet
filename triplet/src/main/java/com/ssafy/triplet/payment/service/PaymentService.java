package com.ssafy.triplet.payment.service;

import com.ssafy.triplet.account.entity.Account;
import com.ssafy.triplet.account.entity.TransactionList;
import com.ssafy.triplet.account.repository.AccountRepository;
import com.ssafy.triplet.account.repository.TransactionListRepository;
import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import com.ssafy.triplet.notification.service.FCMService;
import com.ssafy.triplet.payment.dto.request.PaymentRequest;
import com.ssafy.triplet.payment.dto.response.PaymentResponse;
import com.ssafy.triplet.travel.entity.*;
import com.ssafy.triplet.travel.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final MerchantRepository merchantRepository;
    private final AccountRepository accountRepository;
    private final TransactionListRepository transactionListRepository;

    private final TravelWalletRepository travelWalletRepository;
    private final TravelTransactionListRepository travelTransactionListRepository;

    private final TravelBudgetRepository travelBudgetRepository;

    private final MemberRepository memberRepository;
    private final TravelMemberRepository travelMemberRepository;

    private final FCMService fcmService;

    public Merchant getMerchantById(Long id) {
        return merchantRepository.findById(id).orElse(null);
    }

    @Transactional
    public PaymentResponse paymentProcess(PaymentRequest request, String memberId) {
        return request.getIsTravel() ? travelAccountPayment(request, memberId) : commonAccountPayment(request,memberId);
    }


    private void checkPermissions(String memberId, Travel travel) {
        Long id = memberRepository.findIdByMemberId(memberId);
        TravelMember tm = travelMemberRepository.findByMemberIdAndTravelId(id, travel.getId())
                .orElseThrow(() -> new CustomException(CustomErrorCode.ACCOUNT_PERMISSION_DENIED));
    }

    private void checkPermissions(String memberId, Account account) {
        Long id = memberRepository.findIdByMemberId(memberId);
        if (id != account.getMember().getId()) {
            throw new CustomException(CustomErrorCode.ACCOUNT_PERMISSION_DENIED);
        }
    }

    public PaymentResponse travelAccountPayment(PaymentRequest request, String memberId) {
        TravelWallet travelWallet = travelWalletRepository.findById(request.getAccountId())
                .orElseThrow(() -> new CustomException(CustomErrorCode.WITHDRAWAL_ACCOUNT_NOT_FOUND));
        Merchant merchant = merchantRepository.findById(request.getMerchantId())
                .orElseThrow(() -> new CustomException(CustomErrorCode.MERCHANT_NOT_FOUND));

        checkPermissions(memberId, travelWallet.getTravelId());

        validateCurrencyMatch(merchant.getCurrency(), travelWallet.getCurrency());
        Double price = request.getPrice();
        validateWalletBalance(travelWallet.getBalance(), price);

        // 지갑 금액 빼고 기록
        processTransaction(travelWallet, merchant, price);


        // 지출 현황 업데이트
        TravelBudget travelBudget = travelBudgetRepository.findBudgetByCategoryAndTravel(travelWallet.getTravelId().getId(), merchant.getCategory().getCategoryId());
        updateBudget(travelBudget, price);

        PaymentResponse result = PaymentResponse.builder()
                .currency(merchant.getCurrency())
                .merchantName(merchant.getMerchantName())
                .price(price)
                .merchantId(merchant.getId())
                .build();

        return result;
    }

    private void updateBudget(TravelBudget travelBudget, Double price) {
        if (travelBudget == null) {
            throw new CustomException(CustomErrorCode.TRAVEL_BUDGET_NOT_FOUND);
        }
        travelBudget.setUsedBudget(travelBudget.getUsedBudget() + price);
        updateBudgetUsageRate(travelBudget);
    }

    // 50 안넘음 80 안넘음
    // 50 넘음 80 안넘음
    // 50 넘음 80 넘음

    private void updateBudgetUsageRate(TravelBudget travelBudget) {

        String categoryName = travelBudget.getCategory().getCategoryName();
        String messageFifty = getFiftyPercentMessage(categoryName);
        String messageEighty = getEightyPercentMessage(categoryName);

        if (!travelBudget.isOverFifty() && travelBudget.getFiftyBudget() <= travelBudget.getUsedBudget()) {
            travelBudget.setOverFifty(true);
            // 50% 초과 푸시알림
            webPush(travelBudget.getTravel().getId(), "여행 예산 알림 🔔", messageFifty);
        } else if (travelBudget.isOverFifty() && !travelBudget.isOverEight()) {
            if (travelBudget.getEightyBudget() <= travelBudget.getUsedBudget()) {
                travelBudget.setOverEight(true);
                // 80% 초과 푸시알림
                webPush(travelBudget.getTravel().getId(), "여행 예산 알림🔔", messageEighty);
            }
        }
    }

    private String getFiftyPercentMessage(String categoryName) {
        switch (categoryName) {
            case "식비":
                return "식비의 50%가 사용됐네요! 식사가 좋았다면 여행을 공유하고 맛집 추천을 해주세요! 남은 여행도 즐겁게 보내요! 🍽️";
            case "쇼핑":
                return "쇼핑 예산의 절반을 썼어요! 멋진 아이템을 건졌나요? 이제 예산을 잘 관리해서 남은 여행도 즐겨보세요! 🛍️";
            case "교통":
                return "교통비의 50%를 썼습니다! 여행지를 이동할 때는 예산을 고려해 경로를 잘 계획해보세요! 🚗";
            case "관광":
                return "관광비의 절반을 사용했어요! 아직 가볼 곳이 많이 남았나요? 예산을 고려해 알차게 즐겨보세요! 🏰";
            case "숙박":
                return "숙박비의 50%가 사용됐습니다! 남은 일정 동안은 예산을 신중하게 사용해보세요! 🛏️";
            case "기타":
                return "기타 비용의 50%를 사용했어요! 남은 예산으로는 예상치 못한 지출을 잘 관리해봐요! 💡";
            default:
                return categoryName + "의 50%를 사용하셨습니다! 남은 여행도 즐겁게 보내세요!";
        }
    }

    private String getEightyPercentMessage(String categoryName) {
        switch (categoryName) {
            case "식비":
                return "헉! 식비의 80%가 사라졌어요! 이제 남은 예산은 20%뿐! 알뜰하게 마무리해봐요! 🍕";
            case "쇼핑":
                return "쇼핑 예산의 80%가 날아갔네요! 남은 예산은 20%! 조금 더 신중하게 쇼핑해봐요! 🛒";
            case "교통":
                return "교통비의 80%가 소진됐어요! 남은 예산으로 마지막 목적지도 잘 다녀오길 바라요! 🚌";
            case "관광":
                return "관광 예산의 80%가 소진됐어요! 이제 남은 예산은 20%! 계획을 다시 점검해보세요! 🎢";
            case "숙박":
                return "숙박 예산의 80%가 사라졌어요! 이제 남은 숙박 일정을 잘 관리해야겠어요! 🏨";
            case "기타":
                return "기타 비용의 80%가 소진됐습니다! 이제 남은 예산은 20%예요! 남은 일정도 잘 준비해봐요! 🔧";
            default:
                return categoryName + "의 80%를 사용하셨습니다! 남은 예산을 잘 관리하세요!";
        }
    }


    private void webPush(Long travelId, String title, String message){
        List<Member> travelMembers = travelMemberRepository.findMembersByTravelIdAndNotificationEnabled(travelId);
        if(!travelMembers.isEmpty()){
            for(Member member : travelMembers) {
                fcmService.pushNotificationPay(member.getMemberId(),title,message);
            }
        }




    }
    private void processTransaction(TravelWallet travelWallet, Merchant merchant, Double price) {
        updateAccountBalance(travelWallet, price);
        Category category = merchant.getCategory();
        Travel travel = travelWallet.getTravelId();
        logTransaction(travelWallet, price, category, merchant.getMerchantName(), travel);
    }

    private void updateAccountBalance(TravelWallet travelWallet, Double amount) {
        travelWallet.setBalance(travelWallet.getBalance() - amount);
        travelWalletRepository.save(travelWallet);
    }

    private void logTransaction(TravelWallet travelWallet, Double price, Category category, String merchantName, Travel travel) {
        TravelTransactionList transaction = new TravelTransactionList();
        transaction.setPrice(price);
        transaction.setTransactionDate(LocalDateTime.now());
        transaction.setBalance(travelWallet.getBalance());
        transaction.setCategory(category);
        transaction.setTransactionName(merchantName);
        transaction.setTravel(travel);
        travelTransactionListRepository.save(transaction);
    }


    public PaymentResponse commonAccountPayment(PaymentRequest request, String memberId) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new CustomException(CustomErrorCode.WITHDRAWAL_ACCOUNT_NOT_FOUND));

        Merchant merchant = merchantRepository.findById(request.getMerchantId())
                .orElseThrow(() -> new CustomException(CustomErrorCode.MERCHANT_NOT_FOUND));

        checkPermissions(memberId,account);

        validateCurrencyMatch(merchant.getCurrency(), account.getCurrency());

        Double price = request.getPrice();
        validateWalletBalance(account.getAccountBalance(), price);

        processTransaction(account, merchant, price);

        PaymentResponse result = PaymentResponse.builder()
                .currency(merchant.getCurrency())
                .merchantName(merchant.getMerchantName())
                .price(price)
                .merchantId(merchant.getId())
                .build();

        return result;
    }


    private void processTransaction(Account account, Merchant merchant, Double price) {
        updateAccountBalance(account, price);
        logTransaction(account, 2, price, "출금", merchant.getMerchantName(), merchant.getAccountNumber());
    }

    private void updateAccountBalance(Account account, Double amount) {
        account.setAccountBalance(account.getAccountBalance() - amount);
        accountRepository.save(account);
    }

    private void logTransaction(Account account, int transactionType, Double amount, String typeName, String transactionName, String targetAccountNumber) {
        TransactionList transaction = TransactionList.builder()
                .transactionType(transactionType) // 트랜잭션 타입 상수로 치환 가능
                .transactionTypeName(typeName)
                .transactionAccountNumber(targetAccountNumber)
                .price(amount)
                .transactionAfterBalance(account.getAccountBalance())
                .transactionName(transactionName)
                .account(account)
                .build();
        transactionListRepository.save(transaction);
    }


    private void validateWalletBalance(Double balance, Double price) {
        if (balance < price) {
            throw new CustomException(CustomErrorCode.INSUFFICIENT_BALANCE);
        }
        if (0 >= price) {
            throw new CustomException(CustomErrorCode.INVALID_PRICE_VALUE);
        }
    }

    private void validateCurrencyMatch(String merchantCurrency, String accountCurrency) {
        if (!merchantCurrency.equals(accountCurrency)) {
            throw new CustomException(CustomErrorCode.MERCHANT_AND_PAYMENT_CURRENCY_MISMATCH);
        }
    }


}

package com.ssafy.triplet.travel.service;

import com.ssafy.triplet.account.dto.response.AccountRechargeResponse;
import com.ssafy.triplet.account.repository.AccountRepository;
import com.ssafy.triplet.account.service.AccountService;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import com.ssafy.triplet.travel.dto.request.TravelRequest;
import com.ssafy.triplet.travel.dto.request.TravelShareRequest;
import com.ssafy.triplet.travel.dto.response.*;
import com.ssafy.triplet.travel.entity.*;
import com.ssafy.triplet.travel.repository.*;
import com.ssafy.triplet.travel.specification.TravelSpecification;
import com.ssafy.triplet.travel.util.InviteCodeGenerator;
import com.ssafy.triplet.travel.util.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TravelService {
    private final TravelRepository travelRepository;
    private final MemberRepository memberRepository;
    private final TravelMemberRepository travelMemberRepository;
    private final TravelBudgetRepository travelBudgetRepository;
    private final CategoryRepository categoryRepository;
    private final CountryRepository countryRepository;
    private final GroupAccountStakeRepostory groupAccountStakeRepostory;
    private final TravelWalletRepository travelWalletRepository;
    private final AccountRepository accountRepository;
    private final TravelWalletService travelWalletService;
    private final AccountService accountService;
    private final S3Service s3Service;

    @Transactional
    public TravelResponse createTravel(Long userId, TravelRequest request, MultipartFile image) throws IOException {
        validateTravelRequest(request);
        String inviteCode = InviteCodeGenerator.generateInviteCode();
        Travel travel = buildTravel(userId, request, image, inviteCode);
        Travel savedTravel = travelRepository.save(travel);
        insertTravelMembers(userId, travel.getId());
        saveTravelBudgets(request, savedTravel);
        travelWalletService.makeTravelWallet(savedTravel, userId);
        insertGroupAccountStake(userId, savedTravel);
        return buildTravelResponse(savedTravel, inviteCode);
    }

    @Transactional
    public TravelResponse updateTravel(Long travelId, TravelRequest request, MultipartFile image, Long userId) throws IOException {
        validateTravelRequest(request);
        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new CustomException("T0004", "여행이 존재하지 않습니다."));
        Long creatorId = travelRepository.findCreatorIdByTravelId(travelId);
        if (!userId.equals(creatorId)) {
            throw new CustomException("T0011", "여행 생성자가 아닙니다.");
        }
        travel.setStartDate(request.getStartDate());
        travel.setEndDate(request.getEndDate());
        travel.setTitle(request.getTitle());
        travel.setMemberCount(request.getMemberCount());
        travel.setTotalBudget(request.getTotalBudget());
        if (image != null && !image.isEmpty()) {
            String fileUrl = s3Service.uploadFile(image);
            travel.setImage(fileUrl);
        }
        Country country = countryRepository.findById(request.getCountry())
                .orElseThrow(() -> new CustomException("T0006", "국가를 찾을 수 없습니다."));
        travel.setCountry(country);
        Travel updatedTravel = travelRepository.save(travel);
        updateTravelBudgets(request, updatedTravel);
        return buildTravelResponse(updatedTravel, travel.getInviteCode());
    }

    @Transactional
    public void deleteTravel(Long travelId, Long userId) {
        // 여행 지갑에 잔액 있는지 확인하는 로직 추가해야함

        if (travelRepository.existsById(travelId)) {
            Long creatorId = travelRepository.findCreatorIdByTravelId(travelId);
            if (!userId.equals(creatorId)) {
                throw new CustomException("T0011", "여행 생성자가 아닙니다.");
            } else {
                travelRepository.deleteById(travelId);
            }
        } else {
            throw new CustomException("T0004", "여행이 존재하지 않습니다.");
        }
    }

    public TravelListResponse getTravelOngoingList(Long userId) {
        LocalDate today = LocalDate.now();
        Travel travel = travelRepository.findOngoingTravelByUserId(userId, today);
        return convertToTravelListResponse(travel);
    }

    public List<TravelListResponse> getTravelCompleteList(Long userId) {
        LocalDate today = LocalDate.now();
        List<Travel> travelList = travelRepository.findCompletedTravelsByUserId(userId, today);

        List<TravelListResponse> responseList = new ArrayList<>();
        for (Travel travel : travelList) {
            TravelListResponse response = convertToTravelListResponse(travel);
            responseList.add(response);
        }

        return responseList;
    }

    public List<TravelListResponse> getTravelUpcomingList(Long userId) {
        LocalDate today = LocalDate.now();
        List<Travel> travelList = travelRepository.findUpcomingTravelsByUserId(userId, today);
        List<TravelListResponse> responseList = new ArrayList<>();
        for (Travel travel : travelList) {
            responseList.add(convertToTravelListResponse(travel));
        }
        return responseList;
    }

    public TravelResponse getTravel(Long travelId, Long userId) {
        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new CustomException("T0004", "여행이 존재하지 않습니다."));
        TravelResponse travelResponse = buildTravelResponse(travel, travel.getInviteCode());
        if (Objects.equals(userId, travel.getCreatorId())) {
            travelResponse.setMyTravel(true);
        }
        return travelResponse;
    }

    @Transactional
    public void postTravel(Long userId, TravelShareRequest request) {
        Travel travel = travelRepository.findById(request.getTravelId())
                .orElseThrow(() -> new CustomException("T0004", "여행이 존재하지 않습니다."));
        if (!travel.isStatus()) {
            throw new CustomException("T0012", "종료된 여행이 아닙니다.");
        }
        if (!userId.equals(travel.getCreatorId())) {
            throw new CustomException("T0011", "여행 생성자가 아닙니다.");
        }
        if (request.getShareStatus() != 1 && request.getShareStatus() != 0 &&
                request.getIsShared() != 1 && request.getShareStatus() != 0) {
            throw new CustomException("T0007", "0이나 1의 상태만 보낼 수 있습니다.");
        }
        if (request.getIsShared() == 1) {
            travel.setShared(true);
            if (request.getShareStatus() == 1) {
                travel.setShareStatus(true);
            } else {
                travel.setShareStatus(false);
            }
        } else {
            travel.setShared(false);
            travel.setShareStatus(false);
        }
        travelRepository.save(travel);
    }

    @Transactional
    public TravelResponse inviteTravel(String inviteCode, Long userId) {
        Long travelId = travelRepository.findTravelIdByInviteCode(inviteCode);
        if (travelId == null) {
            throw new CustomException("T0001", "초대코드가 유효하지 않습니다.");
        }
        Optional<TravelMember> travelMember = travelMemberRepository.findByMemberIdAndTravelId(userId, travelId);
        if (travelMember.isPresent()) {
            throw new CustomException("T0015", "해당 유저는 이미 이 여행에 속해 있습니다.");
        }
        insertTravelMembers(userId, travelId);
        Travel travel = travelRepository.findById(travelId).orElseThrow(() -> new CustomException("T0004", "여행이 존재하지 않습니다."));
        insertGroupAccountStake(userId, travel);
        return buildTravelResponse(travel, travel.getInviteCode());
    }

    public List<CountryResponse> countryList() {
        return countryRepository.getAllCountries();
    }

    public List<CategoryResponse> getCategoryList() {
        return categoryRepository.getAllCategories();
    }

    public List<TravelBudgetResponse> getTravelBudgetList(Long travelId) {
        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new CustomException("T0004", "여행이 존재하지 않습니다."));
        return travelBudgetRepository.findBudgetResponseByTravel(travel);
    }

    public Page<TravelListResponse> getTravelSNSList(Long userId, String countryName, Integer memberCount, Double minBudget, Double maxBudget,
                                                     Integer month, Integer minDays, Integer maxDays, int page, int size) {

        Specification<Travel> spec = Specification.where(TravelSpecification.excludeCreator(userId))
                .and(countryName != null ? TravelSpecification.countryNameContains(countryName) : null)
                .and(memberCount != null ? TravelSpecification.memberCountEquals(memberCount) : null)
                .and(minBudget != null && maxBudget != null ? TravelSpecification.totalBudgetWonBetween(minBudget, maxBudget) : null)
                .and(month != null ? TravelSpecification.travelMonth(month) : null)
                .and(minDays != null && maxDays != null ? TravelSpecification.travelDurationBetween(minDays, maxDays) : null);

        Pageable pageable = PageRequest.of(page, size);
        return travelRepository.findAll(spec, pageable)
                .map(this::convertToTravelListResponse);
    }

    public TravelListPagedResponse toPagedResponse(Page<TravelListResponse> page) {
        TravelListPagedResponse response = new TravelListPagedResponse();
        response.setContent(page.getContent());
        response.setPageNumber(page.getNumber());
        response.setLast(page.isLast());
        response.setTotalPages(page.getTotalPages());
        response.setTotalElements(page.getTotalElements());
        response.setNumber(page.getNumber());
        return response;
    }

    @Transactional
    public void finishTravel(Long travelId) {
        Travel travel = travelRepository.findById(travelId).orElseThrow(() -> new CustomException("T0004", "여행이 존재하지 않습니다."));
        double balance = travelWalletRepository.findBalanceByTravel(travelId);
        if (balance != 0) {
            // 여행의 지갑 ID
            Long travelWalletId = travelWalletRepository.findTravelWalletIdByTravel(travelId);

            // 멤버와 해당 멤버가 낸 금액 리스트
            List<Object[]> memberAndMoneyList = groupAccountStakeRepostory.findMemberAndTotalMoneyByTravelId(travelWalletId);

            // 전체 금액 계산
            double totalMoney = 0;
            for (Object[] row : memberAndMoneyList) {
                totalMoney += (Double) row[1];
            }

            // 전체 금액 중 남은 금액 분배
            double distributedBalance = 0;
            for (Object[] row : memberAndMoneyList) {
                Long memberId = (Long) row[0];
                Double memberMoney = (Double) row[1];

                // 비율 계산 (멤버가 낸 금액 / 총 금액)
                double contributionPercentage = memberMoney / totalMoney;

                // 멤버가 받을 금액 = 남은 balance * 비율
                double amountToDistribute = balance * contributionPercentage;
                distributedBalance += amountToDistribute;  // 분배된 금액 누적

                // 멤버에게 금액 분배
                distributeToMemberAccount(memberId, amountToDistribute, travel.getCountry().getCurrency(), travelId);
            }

            double remainingBalance = balance - distributedBalance;
            Long creatorId = travelRepository.findCreatorIdByTravelId(travelId);
            distributeToMemberAccount(creatorId, remainingBalance, travel.getCountry().getCurrency(), travelId);
        }

        travelRepository.updateStatusByTravelId(travelId, true);
        travelWalletRepository.deleteByTravelId(travelId);
    }

    // 금액 분배를 처리하는 메서드
    private void distributeToMemberAccount(Long memberId, double amount, String currency, Long travelId) {
        AccountRechargeResponse response = accountRepository.findAccountNumberByMemberIdAndCurrency(memberId, currency);
        double updatedAccountBalance = response.getAccountBalance() + amount;
        accountService.rechargeForTravelAccount(response.getAccountNumber(), updatedAccountBalance);
        double balanceTravelWallet = travelWalletRepository.findBalanceByTravel(travelId);
        double updatedWalletBalance = balanceTravelWallet - amount;
        travelWalletRepository.rechargeTravelWallet(travelId, updatedWalletBalance);
    }






    /* 중복 메서드 */
    // 필수 값 및 날짜 검증 메서드 (여행 생성, 여행 수정)
    private void validateTravelRequest(TravelRequest request) {
        if (request.getTitle() == null || request.getTitle().isEmpty() ||
                request.getStartDate() == null || request.getEndDate() == null ||
                request.getMemberCount() <= 0 || request.getTotalBudget() <= 0 ||
                request.getCountry() <= 0 || request.getBudgets() == null || request.getBudgets().isEmpty()) {
            throw new CustomException("T0002", "필수 입력 값이 비어있습니다.");
        }

        LocalDate currentDate = LocalDate.now();
        if (request.getStartDate().isBefore(currentDate)) {
            throw new CustomException("T0003", "시작일은 현재 날짜보다 이후여야 합니다.");
        }
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new CustomException("T0009", "종료일은 시작일보다 이후여야 합니다.");
        }
    }

    // Travel 객체 생성 메서드 (여행 생성)
    private Travel buildTravel(Long userId, TravelRequest request, MultipartFile image, String inviteCode) throws IOException {
        Travel travel = new Travel();
        travel.setInviteCode(inviteCode);
        travel.setStartDate(request.getStartDate());
        travel.setEndDate(request.getEndDate());
        travel.setTitle(request.getTitle());
        travel.setMemberCount(request.getMemberCount());
        travel.setTotalBudget(request.getTotalBudget());
        travel.setCreatorId(userId);

        if (image != null && !image.isEmpty()) {
            String fileUrl = s3Service.uploadFile(image);
            travel.setImage(fileUrl);
        }

        Country country = countryRepository.findById(request.getCountry())
                .orElseThrow(() -> new CustomException("T0006", "국가를 찾을 수 없습니다."));
        travel.setCountry(country);

        return travel;
    }

    // TravelBudget 저장 메서드 (여행 생성)
    private void saveTravelBudgets(TravelRequest request, Travel travel) {
        for (TravelRequest.BudgetDTO budgetDTO : request.getBudgets()) {
            TravelBudget travelBudget = new TravelBudget();
            travelBudget.setCategory(categoryRepository.findById(budgetDTO.getCategoryId())
                    .orElseThrow(() -> new CustomException("T0008", "카테고리를 찾을 수 없습니다.")));
            travelBudget.setCategoryBudget(budgetDTO.getBudget());
            travelBudget.setBudgetWon(budgetDTO.getBudgetWon());
            travelBudget.setTravel(travel);
            travelBudget.setFiftyBudget((budgetDTO.getBudget()/2));
            travelBudget.setEightyBudget((budgetDTO.getBudget()*0.8));
            travelBudgetRepository.save(travelBudget);
        }
    }

    // 응답 생성 메서드 (여행 생성, 여행 수정)
    private TravelResponse buildTravelResponse(Travel travel, String inviteCode) {
        TravelResponse response = new TravelResponse();
        response.setInviteCode(inviteCode);
        response.setTravelId(travel.getId());
        response.setCountry(travel.getCountry().getName());
        response.setCountryId(travel.getCountry().getId());
        response.setCurrency(travel.getCountry().getCurrency());
        response.setStartDate(travel.getStartDate());
        response.setEndDate(travel.getEndDate());
        response.setTitle(travel.getTitle());
        response.setImage(travel.getImage());
        response.setMemberCount(travel.getMemberCount());
        response.setTotalBudget(travel.getTotalBudget());
        response.setCreatorId(travel.getCreatorId());
        response.setStatus(travel.isStatus());
        response.setShared(travel.isShared());
        response.setShareStatus(travel.isShareStatus());

        List<TravelBudget> savedBudgets = travelBudgetRepository.findByTravel(travel);
        response.setBudgets(
                savedBudgets.stream()
                        .map(travelBudget -> new TravelResponse.BudgetDTO(
                                travelBudget.getCategory().getCategoryId(),
                                travelBudget.getCategory().getCategoryName(),
                                travelBudget.getCategoryBudget(),
                                travelBudget.getBudgetWon()))
                        .collect(Collectors.toList())
        );

        return response;
    }

    // 여행 예산 테이블 수정
    private void updateTravelBudgets(TravelRequest request, Travel travel) {
        List<TravelBudget> existingBudgets = travelBudgetRepository.findByTravel(travel);
        for (TravelRequest.BudgetDTO budgetDTO : request.getBudgets()) {
            TravelBudget existingBudget = existingBudgets.stream()
                    .filter(budget -> budget.getCategory() != null &&
                            budget.getCategory().getCategoryId() == budgetDTO.getCategoryId())
                    .findFirst()
                    .orElseThrow(() -> new CustomException("T0010", "해당 카테고리 예산을 찾을 수 없습니다."));

            existingBudget.setCategoryBudget(budgetDTO.getBudget());
            existingBudget.setBudgetWon(budgetDTO.getBudgetWon());
            existingBudget.setFiftyBudget((budgetDTO.getBudget()/2));
            existingBudget.setEightyBudget((budgetDTO.getBudget()*0.8));

            travelBudgetRepository.save(existingBudget);
        }
    }

    // 여행 멤버 테이블에 추가
    private void insertTravelMembers(Long userId, Long travelId) {
        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new CustomException("T0004", "여행이 존재하지 않습니다."));
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new CustomException("M0010", "존재하지 않는 회원입니다."));
        TravelMember travelMember = new TravelMember();
        travelMember.setTravel(travel);
        travelMember.setMember(member);
        travelMemberRepository.save(travelMember);
    }

    // 여행 리스트
    private TravelListResponse convertToTravelListResponse(Travel travel) {
        TravelListResponse response = new TravelListResponse();
        response.setTravelId(travel.getId());
        response.setTitle(travel.getTitle());
        response.setStartDate(travel.getStartDate());
        response.setEndDate(travel.getEndDate());
        response.setImage(travel.getImage());
        response.setCountryId(travel.getCountry().getId());
        response.setCountryName(travel.getCountry().getName());
        response.setMemberCount(travel.getMemberCount());
        response.setCurrency(travel.getCountry().getCurrency());
        response.setTotalBudget(travel.getTotalBudget());
        return response;
    }

    public void insertGroupAccountStake(Long userId, Travel travel) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new CustomException("M0010", "존재하지 않는 회원입니다."));
        TravelWallet travelWallet = travelWalletRepository.findByTravelId(travel);
        GroupAccountStake groupAccountStake = new GroupAccountStake();
        groupAccountStake.setMember(member);
        groupAccountStake.setTravelWallet(travelWallet);
        groupAccountStakeRepostory.save(groupAccountStake);
    }
}
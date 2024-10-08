package com.ssafy.triplet.travel.service;

import co.elastic.clients.elasticsearch._types.SortOrder;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.json.JsonData;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.triplet.account.dto.response.AccountRechargeResponse;
import com.ssafy.triplet.account.repository.AccountRepository;
import com.ssafy.triplet.account.service.AccountService;
import com.ssafy.triplet.exception.CustomErrorCode;
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
import org.hibernate.Hibernate;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.document.Document;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.IndexQuery;
import org.springframework.data.elasticsearch.core.query.IndexQueryBuilder;
import org.springframework.data.elasticsearch.core.query.UpdateQuery;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.core.SearchRequest;
import co.elastic.clients.elasticsearch.core.SearchResponse;
import co.elastic.clients.elasticsearch.core.search.Hit;

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
    private final InviteCodeGenerator inviteCodeGenerator;
    private final ElasticsearchService elasticsearchService;

    @Transactional
    public TravelResponse createTravel(Long userId, TravelRequest request, MultipartFile image) throws IOException {
        validateTravelRequest(request, userId, 0L);
        String inviteCode = inviteCodeGenerator.generateInviteCode(request.getEndDate());
        Travel travel = buildTravel(userId, request, image, inviteCode);
        Travel savedTravel = travelRepository.save(travel);
        insertTravelMembers(userId, travel.getId());
        manageTravelBudgets(request, savedTravel, false);
        travelWalletService.makeTravelWallet(savedTravel, userId);
        insertGroupAccountStake(userId, savedTravel);
        return buildTravelResponse(savedTravel, inviteCode);
    }

    @Transactional
    public TravelResponse updateTravel(TravelRequest request, MultipartFile image, Long userId) throws IOException {
        validateTravelRequest(request, userId, request.getTravelId());
        Travel travel = travelRepository.findById(request.getTravelId())
                .orElseThrow(() -> new CustomException(CustomErrorCode.TRAVEL_NOT_FOUND));
        Long creatorId = travelRepository.findCreatorIdByTravelId(request.getTravelId());
        if (!userId.equals(creatorId)) {
            throw new CustomException(CustomErrorCode.NOT_TRAVEL_CREATOR);
        }
        if (!request.getEndDate().equals(travel.getEndDate())) {
            travel.setEndDate(request.getEndDate());
            inviteCodeGenerator.updateInviteCodeExpiry(travel.getInviteCode(), request.getEndDate());
        }
        travel.setStartDate(request.getStartDate());
        travel.setEndDate(request.getEndDate());
        travel.setTitle(request.getTitle());
        travel.setMemberCount(request.getMemberCount());
        travel.setTotalBudget(request.getTotalBudget());
        travel.setAirportCost(request.getAirportCost());

        if (image != null && !image.isEmpty()) {
            s3Service.deleteFile(travel.getImage());
            long maxFileSize = 5 * 1024 * 1024;
            if (image.getSize() > maxFileSize) {
                throw new CustomException(CustomErrorCode.MAX_UPLOAD_SIZE_EXCEEDED);
            }
            String fileUrl = s3Service.uploadFile(image);
            travel.setImage(fileUrl);
        } else if (request.getImgUrl().equals("")) {
            if (travel.getImage().contains("triplet-vteam.s3")) {
                System.out.println(travel.getImage() + "=======================");
                s3Service.deleteFile(travel.getImage());
            }
            String countryName = countryRepository.findNameById(request.getCountry());
            String countryImg = getDefaultImg().get("defaultImages").get(countryName).asText();
            travel.setImage(countryImg);
        }

        Country country = countryRepository.findById(request.getCountry())
                .orElseThrow(() -> new CustomException(CustomErrorCode.COUNTRY_NOT_FOUND));
        travel.setCountry(country);
        Travel updatedTravel = travelRepository.save(travel);
        manageTravelBudgets(request, updatedTravel, true);
        return buildTravelResponse(updatedTravel, travel.getInviteCode());
    }

    @Transactional
    public void deleteTravel(Long travelId, Long userId) throws IOException {
        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.TRAVEL_NOT_FOUND));
        TravelWallet travelWallet = travelWalletRepository.findByTravelId(travel);
        if (travelWallet.getBalance() > 0) {
            throw new CustomException(CustomErrorCode.TRAVEL_WALLET_HAS_BALANCE);
        }
        if (!userId.equals(travel.getCreatorId())) {
            throw new CustomException(CustomErrorCode.NOT_TRAVEL_CREATOR);
        }
        if (travel.getImage().contains("triplet-vteam.s3")) {
            s3Service.deleteFile(travel.getImage());
        }
        elasticsearchService.removeTravelInElasticsearch(travelId);
        travelRepository.deleteById(travelId);
    }

    public TravelListResponse getTravelOngoingList(Long userId) {
        LocalDate today = LocalDate.now();
        Travel travel = travelRepository.findOngoingTravelByUserId(userId, today);
        if (travel == null) {
            return null;
        }
        return convertToTravelListResponse(travel);
    }

    public List<TravelListResponse> getTravelCompleteList(Long userId) {
        LocalDate today = LocalDate.now();
        List<Travel> travelList = travelRepository.findCompletedTravelsByUserId(userId, today);

        if (travelList == null) {
            return null;
        }

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

        if (travelList == null) {
            return null;
        }

        List<TravelListResponse> responseList = new ArrayList<>();
        for (Travel travel : travelList) {
            responseList.add(convertToTravelListResponse(travel));
        }
        return responseList;
    }

    public TravelResponse getTravel(Long travelId, Long userId) {
        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.TRAVEL_NOT_FOUND));
        TravelResponse travelResponse = buildTravelResponse(travel, travel.getInviteCode());
        if (Objects.equals(userId, travel.getCreatorId())) {
            travelResponse.setMyTravel(true);
        }
        return travelResponse;
    }

    @Transactional
    public void postTravel(Long userId, TravelShareRequest request) throws IOException {
        Travel travel = travelRepository.findById(request.getTravelId())
                .orElseThrow(() -> new CustomException(CustomErrorCode.TRAVEL_NOT_FOUND));

        if (!travel.isStatus()) {
            throw new CustomException(CustomErrorCode.TRAVEL_NOT_COMPLETED);
        }
        if (!userId.equals(travel.getCreatorId())) {
            throw new CustomException(CustomErrorCode.NOT_TRAVEL_CREATOR);
        }
        if (request.getShareStatus() != 1 && request.getShareStatus() != 0 &&
                request.getIsShared() != 1 && request.getShareStatus() != 0) {
            throw new CustomException(CustomErrorCode.INVALID_STATUS_VALUE);
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
        elasticsearchService.updateTravelInElasticsearch(travel);
    }


    @Transactional
    public TravelResponse inviteTravel(String inviteCode, Long userId) {
        Travel travel = travelRepository.findTravelIdByInviteCode(inviteCode);
        if (travel == null) {
            throw new CustomException(CustomErrorCode.INVALID_INVITE_CODE);
        }
        Optional<TravelMember> travelMember = travelMemberRepository.findByMemberIdAndTravelId(userId, travel.getId());
        if (travelMember.isPresent()) {
            throw new CustomException(CustomErrorCode.USER_ALREADY_IN_TRAVEL);
        }
        if (travel.getMemberCount() <= travelMemberRepository.countByTravelId(travel.getId())) {
            throw new CustomException(CustomErrorCode.TRAVEL_MEMBER_LIMIT_EXCEEDED);
        }
        insertTravelMembers(userId, travel.getId());
        insertGroupAccountStake(userId, travel);
        return buildTravelResponse(travel, travel.getInviteCode());
    }

    @Cacheable(value = "countryList")
    public List<CountryResponse> countryList() {
        return countryRepository.getAllCountries();
    }

    public List<CategoryResponse> getCategoryList() {
        return categoryRepository.getAllCategories();
    }

    public Map<String, Object> getTravelBudgetList(Long travelId) {
        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.TRAVEL_NOT_FOUND));
        boolean isComplete = travel.isStatus();
        List<?> budgetList;

        if (!isComplete) {
            budgetList = travelBudgetRepository.findBudgetResponseByTravel(travel);
        } else {
            budgetList = travelBudgetRepository.findCompleteBudgetResponseByTravel(travel);
        }
        Map<String, Object> resultMap = new LinkedHashMap<>();
        resultMap.put("isComplete", isComplete);
        resultMap.put("budgetList", budgetList);
        return resultMap;
    }

    @Transactional
    public void finishTravel(Long travelId) {
        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.TRAVEL_NOT_FOUND));
        double balance = travelWalletRepository.findBalanceByTravel(travelId);
        if (balance != 0) {
            if (travel.getMemberCount() == 1) {
                handleSingleMemberTravel(balance, travel);
            } else {
                handleMultiMemberTravel(balance, travelId, travel);
            }
        }
        travelRepository.updateStatusByTravelId(travelId, true);
        travelWalletRepository.deleteByTravelId(travelId);
    }

    private void handleSingleMemberTravel(double balance, Travel travel) {
        AccountRechargeResponse response = accountRepository.findAccountNumberByMemberIdAndCurrency(
                travel.getCreatorId(), travel.getCountry().getCurrency());
        double updatedAccountBalance = response.getAccountBalance() + balance;
        accountService.rechargeForTravelAccount(response.getAccountNumber(), updatedAccountBalance);
    }

    private void handleMultiMemberTravel(double balance, Long travelId, Travel travel) {
        Long travelWalletId = travelWalletRepository.findTravelWalletIdByTravel(travelId);
        List<Object[]> memberAndMoneyList = groupAccountStakeRepostory.findMemberAndTotalMoneyByTravelId(travelWalletId);
        double totalMoney = calculateTotalMoney(memberAndMoneyList);
        double distributedBalance = distributeBalanceToMembers(memberAndMoneyList, balance, totalMoney, travel);
        distributeRemainingBalance(balance, distributedBalance, travelId, travel);
    }

    private double calculateTotalMoney(List<Object[]> memberAndMoneyList) {
        return memberAndMoneyList.stream()
                .mapToDouble(row -> (Double) row[1])
                .sum();
    }

    private double distributeBalanceToMembers(List<Object[]> memberAndMoneyList, double balance, double totalMoney, Travel travel) {
        double distributedBalance = 0;
        for (Object[] row : memberAndMoneyList) {
            Long memberId = (Long) row[0];
            Double memberMoney = (Double) row[1];
            if (memberMoney != 0) {
                double contributionPercentage = memberMoney / totalMoney;
                double amountToDistribute = Math.floor(balance * contributionPercentage);
                distributedBalance += amountToDistribute;
                distributeToMemberAccount(memberId, amountToDistribute, travel.getCountry().getCurrency(), travel.getId());
            }
        }
        return distributedBalance;
    }

    private void distributeRemainingBalance(double balance, double distributedBalance, Long travelId, Travel travel) {
        double remainingBalance = balance - distributedBalance;
        Long creatorId = travelRepository.findCreatorIdByTravelId(travelId);
        distributeToMemberAccount(creatorId, remainingBalance, travel.getCountry().getCurrency(), travelId);
    }

    private void distributeToMemberAccount(Long memberId, double amount, String currency, Long travelId) {
        AccountRechargeResponse response = accountRepository.findAccountNumberByMemberIdAndCurrency(memberId, currency);
        double updatedAccountBalance = response.getAccountBalance() + amount;
        accountService.rechargeForTravelAccount(response.getAccountNumber(), updatedAccountBalance);
        updateTravelWalletBalance(travelId, amount);
    }

    private void updateTravelWalletBalance(Long travelId, double amount) {
        double balanceTravelWallet = travelWalletRepository.findBalanceByTravel(travelId);
        double updatedWalletBalance = balanceTravelWallet - amount;
        travelWalletRepository.rechargeTravelWallet(travelId, updatedWalletBalance);
    }

    @Transactional
    public void leaveTravel(Long userId, Long travelId) {
        Travel travel = travelRepository.findById(travelId).orElseThrow(() -> new CustomException(CustomErrorCode.TRAVEL_NOT_FOUND));
        Optional<TravelMember> travelMember = travelMemberRepository.findByMemberIdAndTravelId(userId, travelId);
        if (travelMember.isEmpty()) {
            throw new CustomException(CustomErrorCode.USER_NOT_IN_TRAVEL);
        }
        TravelWallet travelWallet = travelWalletRepository.findByTravelId(travel);
        groupAccountStakeRepostory.deleteGroupAccountStake(travelWallet, userId);
        travelMemberRepository.deleteByMemberIdAndTravelId(userId, travelId);
    }


    /* 중복 메서드 */
    // 필수 값 및 날짜 검증 메서드 (여행 생성, 여행 수정)
    private void validateTravelRequest(TravelRequest request, Long userId, Long travelId) {
        validateRequiredFields(request);
        validateTravelDates(request.getStartDate(), request.getEndDate());
        checkForTravelScheduleConflicts(request, userId, travelId);
    }

    private void validateRequiredFields(TravelRequest request) {
        if (request.getTitle() == null || request.getTitle().isEmpty() ||
                request.getStartDate() == null || request.getEndDate() == null ||
                request.getMemberCount() <= 0 || request.getTotalBudget() <= 0 ||
                request.getCountry() <= 0 || request.getBudgets() == null || request.getBudgets().isEmpty()) {
            throw new CustomException(CustomErrorCode.REQUIRED_VALUE_MISSING);
        }
    }

    private void validateTravelDates(LocalDate startDate, LocalDate endDate) {
        LocalDate currentDate = LocalDate.now();
        if (startDate.isBefore(currentDate)) {
            throw new CustomException(CustomErrorCode.INVALID_TRAVEL_START_DATE);
        }
        if (endDate.isBefore(startDate)) {
            throw new CustomException(CustomErrorCode.INVALID_TRAVEL_END_DATE);
        }
    }

    private void checkForTravelScheduleConflicts(TravelRequest request, Long userId, Long travelId) {
        List<Travel> travelList = travelRepository.findAllTravelByUserId(userId);
        for (Travel travel : travelList) {
            if (!Objects.equals(travel.getId(), travelId) && isTravelDatesOverlap(request.getStartDate(), request.getEndDate(), travel)) {
                throw new CustomException(CustomErrorCode.TRAVEL_SCHEDULE_CONFLICT);
            }
        }
    }

    private boolean isTravelDatesOverlap(LocalDate startDate, LocalDate endDate, Travel travel) {
        return (startDate.isEqual(travel.getStartDate()) || startDate.isAfter(travel.getStartDate())) &&
                (startDate.isBefore(travel.getEndDate()) || startDate.isEqual(travel.getEndDate())) ||
                (endDate.isEqual(travel.getStartDate()) || endDate.isAfter(travel.getStartDate())) &&
                        (endDate.isBefore(travel.getEndDate()) || endDate.isEqual(travel.getEndDate())) ||
                (startDate.isBefore(travel.getStartDate()) && endDate.isAfter(travel.getEndDate()));
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
        travel.setAirportCost(request.getAirportCost());

        if (image != null && !image.isEmpty()) {
            long maxFileSize = 5 * 1024 * 1024;
            if (image.getSize() > maxFileSize) {
                throw new CustomException(CustomErrorCode.MAX_UPLOAD_SIZE_EXCEEDED);
            }
            String fileUrl = s3Service.uploadFile(image);
            travel.setImage(fileUrl);
        } else {
            String countryName = countryRepository.findNameById(request.getCountry());
            String countryImg = getDefaultImg().get("defaultImages").get(countryName).asText();
            travel.setImage(countryImg);
        }

        Country country = countryRepository.findById(request.getCountry())
                .orElseThrow(() -> new CustomException(CustomErrorCode.COUNTRY_NOT_FOUND));
        travel.setCountry(country);

        return travel;
    }

    private void manageTravelBudgets(TravelRequest request, Travel travel, boolean isUpdate) {
        List<TravelBudget> existingBudgets = isUpdate ? travelBudgetRepository.findByTravel(travel) : new ArrayList<>();

        for (TravelRequest.BudgetDTO budgetDTO : request.getBudgets()) {
            TravelBudget travelBudget;

            if (isUpdate) {
                travelBudget = existingBudgets.stream()
                        .filter(budget -> budget.getCategory() != null &&
                                budget.getCategory().getCategoryId() == budgetDTO.getCategoryId())
                        .findFirst()
                        .orElseThrow(() -> new CustomException(CustomErrorCode.TRAVEL_SCHEDULE_CONFLICT));
            } else {
                travelBudget = new TravelBudget();
                travelBudget.setCategory(categoryRepository.findById(budgetDTO.getCategoryId())
                        .orElseThrow(() -> new CustomException(CustomErrorCode.CATEGORY_NOT_FOUND)));
                travelBudget.setTravel(travel);
            }

            travelBudget.setCategoryBudget(budgetDTO.getBudget());
            travelBudget.setBudgetWon(budgetDTO.getBudgetWon());
            travelBudget.setFiftyBudget(budgetDTO.getBudget() / 2);
            travelBudget.setEightyBudget(budgetDTO.getBudget() * 0.8);

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
        response.setAirportCost(travel.getAirportCost());

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


    // 여행 멤버 테이블에 추가
    private void insertTravelMembers(Long userId, Long travelId) {
        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.TRAVEL_NOT_FOUND));
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.MEMBER_NOT_FOUND));
        TravelMember travelMember = new TravelMember();
        travelMember.setTravel(travel);
        travelMember.setMember(member);
        travelMemberRepository.save(travelMember);
    }

    // 여행 리스트
    private TravelListResponse convertToTravelListResponse(Travel travel) {
        TravelListResponse response = new TravelListResponse();
        double usedBudgets = travelBudgetRepository.findTotalUsedBudgetByTravel(travel.getId());
        response.setUsedBudget(usedBudgets);
        response.setTotalBudget(travel.getTotalBudget());
        response.setTravelId(travel.getId());
        response.setTitle(travel.getTitle());
        response.setStartDate(travel.getStartDate());
        response.setEndDate(travel.getEndDate());
        response.setImage(travel.getImage());
        response.setCountryId(travel.getCountry().getId());
        response.setCountryName(travel.getCountry().getName());
        response.setMemberCount(travel.getMemberCount());
        response.setCurrency(travel.getCountry().getCurrency());
        return response;
    }

    public void insertGroupAccountStake(Long userId, Travel travel) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.MEMBER_NOT_FOUND));
        TravelWallet travelWallet = travelWalletRepository.findByTravelId(travel);
        GroupAccountStake groupAccountStake = new GroupAccountStake();
        groupAccountStake.setMember(member);
        groupAccountStake.setTravelWallet(travelWallet);
        groupAccountStake.setTotalMoney(0d);
        groupAccountStakeRepostory.save(groupAccountStake);
    }

    public JsonNode getDefaultImg() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        Resource resource = new ClassPathResource("defaultImages.json");
        InputStream inputStream = resource.getInputStream();
        JsonNode jsonNode = objectMapper.readTree(inputStream);
        return jsonNode;
    }
}
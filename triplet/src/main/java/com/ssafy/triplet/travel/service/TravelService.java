package com.ssafy.triplet.travel.service;

//import co.elastic.clients.elasticsearch._types.SortOrder;
//import co.elastic.clients.elasticsearch._types.query_dsl.*;
//import co.elastic.clients.json.JsonData;
import com.ssafy.triplet.account.dto.response.AccountRechargeResponse;
import com.ssafy.triplet.account.repository.AccountRepository;
import com.ssafy.triplet.account.service.AccountService;
import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import com.ssafy.triplet.travel.dto.request.TravelCreateRequest;
import com.ssafy.triplet.travel.dto.request.TravelRequest;
import com.ssafy.triplet.travel.dto.request.TravelShareRequest;
import com.ssafy.triplet.travel.dto.response.*;
import com.ssafy.triplet.travel.entity.*;
import com.ssafy.triplet.travel.repository.*;
import com.ssafy.triplet.travel.specification.TravelSpecification;
import com.ssafy.triplet.travel.util.InviteCodeGenerator;
import com.ssafy.triplet.travel.util.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.IndexQuery;
import org.springframework.data.elasticsearch.core.query.IndexQueryBuilder;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
//import org.springframework.data.domain.PageImpl;

import java.io.IOException;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
//import co.elastic.clients.elasticsearch.core.SearchRequest;
//import co.elastic.clients.elasticsearch.core.SearchResponse;
//import co.elastic.clients.elasticsearch.core.search.Hit;

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
    private final ElasticsearchTemplate elasticsearchTemplate;
    private final ElasticsearchClient client;


    @Transactional
    public TravelResponse createTravel(Long userId, TravelCreateRequest request, MultipartFile image) throws IOException {
        validateTravelRequest2(request, userId, 0L);
        String inviteCode = inviteCodeGenerator.generateInviteCode(request.getEndDate());
        Travel travel = buildTravel(userId, request, image, inviteCode);
        Travel savedTravel = travelRepository.save(travel);
        insertTravelMembers(userId, travel.getId());
        saveTravelBudgets2(request, savedTravel);
        travelWalletService.makeTravelWallet(savedTravel, userId);
        insertGroupAccountStake(userId, savedTravel);
        indexTravel(travel);
        indexMember(userId);
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
        }

        Country country = countryRepository.findById(request.getCountry())
                .orElseThrow(() -> new CustomException(CustomErrorCode.COUNTRY_NOT_FOUND));
        travel.setCountry(country);
        Travel updatedTravel = travelRepository.save(travel);
        updateTravelBudgets(request, updatedTravel);
        return buildTravelResponse(updatedTravel, travel.getInviteCode());
    }

    @Transactional
    public void deleteTravel(Long travelId, Long userId) {
        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new CustomException(CustomErrorCode.TRAVEL_NOT_FOUND));
        TravelWallet travelWallet = travelWalletRepository.findByTravelId(travel);
        if (travelWallet.getBalance() > 0) {
            throw new CustomException(CustomErrorCode.TRAVEL_WALLET_HAS_BALANCE);
        }
        if (!userId.equals(travel.getCreatorId())) {
            throw new CustomException(CustomErrorCode.NOT_TRAVEL_CREATOR);
        }
        if (travel.isStatus()) {
            elasticsearchTemplate.delete(travelId.toString(), Travel.class);
        }
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
    public void postTravel(Long userId, TravelShareRequest request) {
        Travel travel = travelRepository.findById(request.getTravelId())
                .orElseThrow(() -> new CustomException(CustomErrorCode.TRAVEL_NOT_FOUND));
        TravelWallet travelWallet = travelWalletRepository.findByTravelId(travel);

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
                travelWallet.setShare(true);
            } else {
                travel.setShareStatus(false);
                travelWallet.setShare(false);
            }
        } else {
            travel.setShared(false);
            travel.setShareStatus(false);
            travelWallet.setShare(false);
        }
        travelRepository.save(travel);
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
        indexMember(userId);
        return buildTravelResponse(travel, travel.getInviteCode());
    }

    @Cacheable(value = "countryList")
    public List<CountryResponse> countryList() {
        return countryRepository.getAllCountries();
    }

    @Cacheable(value = "categoryList")
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

    public Page<TravelListResponse> getTravelSNSList(Long userId, String countryName, Integer memberCount, Double minBudget, Double maxBudget,
                                                     Integer month, Integer minDays, Integer maxDays, int page, int kind, int size) {
//        if (kind == 0) {
//            return getRecommendedTravels(userId, countryName, memberCount, minBudget, maxBudget, month, minDays, maxDays, page, size);
//        } else {
            Specification<Travel> spec = Specification.where(TravelSpecification.excludeCreator(userId))
                    .and(countryName != null ? TravelSpecification.countryNameContains(countryName) : null)
                    .and(memberCount != null ? TravelSpecification.memberCountEquals(memberCount) : null)
                    .and(minBudget != null && maxBudget != null ? TravelSpecification.totalBudgetWonBetween(minBudget, maxBudget) : null)
                    .and(month != null ? TravelSpecification.travelMonth(month) : null)
                    .and(minDays != null && maxDays != null ? TravelSpecification.travelDurationBetween(minDays, maxDays) : null);

            Pageable pageable = PageRequest.of(page, size);
            return travelRepository.findAll(spec, pageable)
                    .map(this::convertToTravelListResponse);
//        }
    }

//    private Page<TravelListResponse> getRecommendedTravels(Long userId, String countryName, Integer memberCount, Double minBudget, Double maxBudget,
//                                                           Integer month, Integer minDays, Integer maxDays, int page, int size) {
//        BoolQuery.Builder boolQuery = QueryBuilders.bool();
//
//        // creatorId 제외
//        if (userId != null) {
//            boolQuery.mustNot(QueryBuilders.term().field("creatorId").value(userId).build()._toQuery());
//        }
//
//        if (countryName != null) {
//            boolQuery.should(QueryBuilders.match().field("countryName").query(countryName).build()._toQuery());
//        }
//        if (memberCount != null) {
//            boolQuery.should(QueryBuilders.term().field("memberCount").value(memberCount).build()._toQuery());
//        }
//        if (minBudget != null && maxBudget != null) {
//            RangeQuery totalBudgetQuery = QueryBuilders.range()
//                    .field("totalBudget")
//                    .gte(JsonData.of(minBudget))
//                    .lte(JsonData.of(maxBudget))
//                    .build();
//            boolQuery.should(totalBudgetQuery._toQuery());
//        }
//        if (month != null) {
//            boolQuery.should(QueryBuilders.term().field("month").value(month).build()._toQuery());
//        }
//        if (minDays != null && maxDays != null) {
//            RangeQuery travelDurationQuery = QueryBuilders.range()
//                    .field("travelDuration")
//                    .gte(JsonData.of(minDays))
//                    .lte(JsonData.of(maxDays))
//                    .build();
//            boolQuery.should(travelDurationQuery._toQuery());
//        }
//
//        // 유사도 계산 쿼리 요청 생성
//        SearchRequest searchRequest = SearchRequest.of(s -> s
//                .index("travel")
//                .query(q -> q.functionScore(fs -> fs
//                        .query(boolQuery.build()._toQuery())
//                        .scoreMode(FunctionScoreMode.Sum)
//                        .boostMode(FunctionBoostMode.Replace)
//                        .functions(f -> f
//                                .weight(1.0)
//                        )
//                ))
//                .from(page * size)
//                .size(size)
//                .minScore(0.1)
//        );
//
//
//        SearchResponse<Travel> searchResponse;
//
//        try {
//            searchResponse = client.search(searchRequest, Travel.class);
//        } catch (IOException e) {
//            throw new CustomException(CustomErrorCode.ELASTICSEARCH_ERROR);
//        }
//
//        List<TravelListResponse> travelListResponses = searchResponse.hits().hits().stream()
//                .map(Hit::source)
//                .map(this::convertToTravelListResponse)
//                .collect(Collectors.toList());
//
//        // 유사도가 모두 0일 경우 최신 여행 목록 제공
//        if (searchResponse.hits().total() == null || searchResponse.hits().total().value() == 0 || travelListResponses.isEmpty()) {
//            travelListResponses = getRecentTravels(page, size);
//        }
//
//        return new PageImpl<>(travelListResponses, PageRequest.of(page, size), searchResponse.hits().total().value());
//    }
//
//    private List<TravelListResponse> getRecentTravels(int page, int size) {
//        // 최신순으로 여행 목록을 가져오는 Elasticsearch 쿼리 생성
//        SearchRequest recentRequest = SearchRequest.of(s -> s
//                .index("travel")
//                .sort(sort -> sort.field(f -> f.field("createdDate").order(SortOrder.Desc))) // createdDate 기준 내림차순 정렬
//                .from(page * size)
//                .size(size)
//        );
//
//        SearchResponse<Travel> recentResponse;
//        try {
//            recentResponse = client.search(recentRequest, Travel.class);
//        } catch (IOException e) {
//            throw new CustomException(CustomErrorCode.ELASTICSEARCH_ERROR);
//        }
//
//        return recentResponse.hits().hits().stream()
//                .map(Hit::source)
//                .map(this::convertToTravelListResponse)
//                .collect(Collectors.toList());
//    }


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


    private void validateTravelRequest2(TravelCreateRequest request, Long userId, Long travelId) {
        if (request.getTitle() == null || request.getTitle().isEmpty() ||
                request.getStartDate() == null || request.getEndDate() == null ||
                request.getMemberCount() <= 0 || request.getTotalBudget() <= 0 ||
                request.getCountry() <= 0 || request.getBudgets() == null || request.getBudgets().isEmpty()) {
            throw new CustomException(CustomErrorCode.REQUIRED_VALUE_MISSING);
        }

        LocalDate currentDate = LocalDate.now();
        if (request.getStartDate().isBefore(currentDate)) {
            throw new CustomException(CustomErrorCode.INVALID_TRAVEL_START_DATE);
        }

        List<Travel> travelList = travelRepository.findAllTravelByUserId(userId);
        for (Travel travel : travelList) {
            if (!Objects.equals(travel.getId(), travelId)) {
                if ((request.getStartDate().isEqual(travel.getStartDate()) || request.getStartDate().isAfter(travel.getStartDate())) &&
                        (request.getStartDate().isBefore(travel.getEndDate()) || request.getStartDate().isEqual(travel.getEndDate())) ||
                        (request.getEndDate().isEqual(travel.getStartDate()) || request.getEndDate().isAfter(travel.getStartDate())) &&
                                (request.getEndDate().isBefore(travel.getEndDate()) || request.getEndDate().isEqual(travel.getEndDate())) ||
                        (request.getStartDate().isBefore(travel.getStartDate()) && request.getEndDate().isAfter(travel.getEndDate()))) {
                    throw new CustomException(CustomErrorCode.TRAVEL_SCHEDULE_CONFLICT);
                }
            }
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new CustomException(CustomErrorCode.INVALID_TRAVEL_END_DATE);
        }
    }

    // Travel 객체 생성 메서드 (여행 생성)
    private Travel buildTravel(Long userId, TravelCreateRequest request, MultipartFile image, String inviteCode) throws IOException {
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
        }

        Country country = countryRepository.findById(request.getCountry())
                .orElseThrow(() -> new CustomException(CustomErrorCode.COUNTRY_NOT_FOUND));
        travel.setCountry(country);

        return travel;
    }

    // TravelBudget 저장 메서드 (여행 생성)
//    private void saveTravelBudgets(TravelRequest request, Travel travel) {
//        for (TravelRequest.BudgetDTO budgetDTO : request.getBudgets()) {
//            TravelBudget travelBudget = new TravelBudget();
//            travelBudget.setCategory(categoryRepository.findById(budgetDTO.getCategoryId())
//                    .orElseThrow(() -> new CustomException(CustomErrorCode.CATEGORY_NOT_FOUND)));
//            travelBudget.setCategoryBudget(budgetDTO.getBudget());
//            travelBudget.setBudgetWon(budgetDTO.getBudgetWon());
//            travelBudget.setTravel(travel);
//            travelBudget.setFiftyBudget((budgetDTO.getBudget() / 2));
//            travelBudget.setEightyBudget((budgetDTO.getBudget() * 0.8));
//            travelBudgetRepository.save(travelBudget);
//        }
//    }

    private void saveTravelBudgets2(TravelCreateRequest request, Travel travel) {
        for (TravelRequest.BudgetDTO budgetDTO : request.getBudgets()) {
            TravelBudget travelBudget = new TravelBudget();
            travelBudget.setCategory(categoryRepository.findById(budgetDTO.getCategoryId())
                    .orElseThrow(() -> new CustomException(CustomErrorCode.CATEGORY_NOT_FOUND)));
            travelBudget.setCategoryBudget(budgetDTO.getBudget());
            travelBudget.setBudgetWon(budgetDTO.getBudgetWon());
            travelBudget.setTravel(travel);
            travelBudget.setFiftyBudget((budgetDTO.getBudget() / 2));
            travelBudget.setEightyBudget((budgetDTO.getBudget() * 0.8));
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

    // 여행 예산 테이블 수정
    private void updateTravelBudgets(TravelRequest request, Travel travel) {
        List<TravelBudget> existingBudgets = travelBudgetRepository.findByTravel(travel);
        for (TravelRequest.BudgetDTO budgetDTO : request.getBudgets()) {
            TravelBudget existingBudget = existingBudgets.stream()
                    .filter(budget -> budget.getCategory() != null &&
                            budget.getCategory().getCategoryId() == budgetDTO.getCategoryId())
                    .findFirst()
                    .orElseThrow(() -> new CustomException(CustomErrorCode.TRAVEL_SCHEDULE_CONFLICT));

            existingBudget.setCategoryBudget(budgetDTO.getBudget());
            existingBudget.setBudgetWon(budgetDTO.getBudgetWon());
            existingBudget.setFiftyBudget((budgetDTO.getBudget() / 2));
            existingBudget.setEightyBudget((budgetDTO.getBudget() * 0.8));

            travelBudgetRepository.save(existingBudget);
        }
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

    public void indexTravel(Travel travel) {
        String id = travel.getId().toString();

        TravelDocument travelDocument = new TravelDocument();
        travelDocument.setTravelId(travel.getId());
        long daysBetween = ChronoUnit.DAYS.between(travel.getStartDate(), travel.getEndDate()) + 1;
        travelDocument.setDays((int) daysBetween);
        travelDocument.setTitle(travel.getTitle());
        travelDocument.setImage(travel.getImage());
        travelDocument.setMemberCount(travel.getMemberCount());
        travelDocument.setStatus(travel.isStatus());
        travelDocument.setCreatorId(travel.getCreatorId());
        travelDocument.setShared(travel.isShared());
        travelDocument.setShareStatus(travel.isShareStatus());
        travelDocument.setTotalBudget(travel.getTotalBudget());
        travelDocument.setTotalBudgetWon(travel.getTotalBudgetWon());
        travelDocument.setCountry(travel.getCountry().getName());

        IndexQuery indexQuery = new IndexQueryBuilder()
                .withId(id)
                .withObject(travelDocument)
                .build();

        elasticsearchTemplate.index(indexQuery, IndexCoordinates.of("travel"));
    }

    public void indexMember(Long userId) {
        String id = userId.toString();
        Member member = memberRepository.findByMemberLongId(userId);

        String birth = member.getBirth();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyMMdd");
        LocalDate birthDate = LocalDate.parse(birth, formatter);

        int age = Period.between(birthDate, LocalDate.now()).getYears();

        boolean genderBoolean = member.getGender(); // gender가 boolean 타입
        int gender = genderBoolean ? 1 : 0;

        MemberDocument memberDocument = new MemberDocument();
        memberDocument.setId(member.getId());
        memberDocument.setAge(age);
        memberDocument.setGender(gender);

        IndexQuery indexQuery = new IndexQueryBuilder()
                .withId(id)
                .withObject(memberDocument)
                .build();

        elasticsearchTemplate.index(indexQuery, IndexCoordinates.of("member"));
    }
}
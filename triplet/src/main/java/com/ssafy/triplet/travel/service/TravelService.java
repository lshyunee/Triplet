package com.ssafy.triplet.travel.service;

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
import org.elasticsearch.client.RestHighLevelClient;
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


import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.data.domain.PageImpl;

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
    private final InviteCodeGenerator inviteCodeGenerator;
    private final ElasticsearchTemplate elasticsearchTemplate;
    private final RestHighLevelClient client;


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

        boolean oldSharedStatus = travel.isShared();
        boolean oldShareStatus = travel.isShareStatus();

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

        if (oldSharedStatus != travel.isShared() || oldShareStatus != travel.isShareStatus()) {
            indexOrUpdateTravel(travel);
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


//    public Page<TravelListResponse> getTravelSNSList(Long userId, String countryName, Integer memberCount, Double minBudget, Double maxBudget,
//                                                     Integer month, Integer minDays, Integer maxDays, int page, int kind, int size) {
//        Specification<Travel> spec = Specification.where(TravelSpecification.excludeCreator(userId))
//                .and(countryName != null ? TravelSpecification.countryNameContains(countryName) : null)
//                .and(memberCount != null ? TravelSpecification.memberCountEquals(memberCount) : null)
//                .and(minBudget != null && maxBudget != null ? TravelSpecification.totalBudgetWonBetween(minBudget, maxBudget) : null)
//                .and(month != null ? TravelSpecification.travelMonth(month) : null)
//                .and(minDays != null && maxDays != null ? TravelSpecification.travelDurationBetween(minDays, maxDays) : null);
//        Pageable pageable = PageRequest.of(page, size);
//        return travelRepository.findAll(spec, pageable)
//                .map(this::convertToTravelListResponse);
//    }

    public Page<TravelListResponse> getTravelSNSList(Long userId, String countryName, Integer memberCount, Double minBudget, Double maxBudget,
                                                     Integer month, Integer minDays, Integer maxDays, int page, int kind, int size) {
        if (kind == 0) {
            return getRecommendedTravels(userId, countryName, memberCount, minBudget, maxBudget, month, minDays, maxDays, page, size);
        } else {
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
    }

    private Page<TravelListResponse> getRecommendedTravels(Long userId, String countryName, Integer memberCount, Double minBudget, Double maxBudget,
                                                           Integer month, Integer minDays, Integer maxDays, int page, int size) {
        SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

// Query 작성
        BoolQueryBuilder boolQuery = QueryBuilders.boolQuery()
                .must(QueryBuilders.termQuery("countryName", countryName)); // 국가 이름 필터링

// 멤버 수 필터링
        if (memberCount != null) {
            boolQuery.must(QueryBuilders.termQuery("memberCount", memberCount));
        }

// 예산 범위 필터링
        if (minBudget != null && maxBudget != null) {
            boolQuery.must(QueryBuilders.rangeQuery("totalBudget")
                    .gte(minBudget)
                    .lte(maxBudget));
        }

// 여행 기간 필터링 (월)
        if (month != null) {
            boolQuery.must(QueryBuilders.termQuery("month", month)); // 여행 시작일의 월을 기준으로 필터링
        }

// 여행 일수 필터링
        if (minDays != null && maxDays != null) {
            boolQuery.must(QueryBuilders.rangeQuery("travelDuration") // travelDuration은 여행 기간을 의미
                    .gte(minDays)
                    .lte(maxDays));
        }

// 최종적으로 boolQuery를 searchSourceBuilder에 설정
        searchSourceBuilder.query(boolQuery);


        // Pagination 설정
        searchSourceBuilder.from(page * size);
        searchSourceBuilder.size(size);

        // Elasticsearch 요청
        SearchRequest searchRequest = new SearchRequest("travel").source(searchSourceBuilder);
        SearchResponse searchResponse;

        try {
            searchResponse = client.search(searchRequest, RequestOptions.DEFAULT); // RestHighLevelClient 사용
        } catch (IOException e) {
            throw new CustomException(CustomErrorCode.ELASTICSEARCH_ERROR); // 예외 처리 필요
        }

        // 결과 변환
        List<TravelListResponse> travelListResponses = Arrays.stream(searchResponse.getHits().getHits())
                .map(hit -> {
                    Map<String, Object> sourceAsMap = hit.getSourceAsMap();
                    Travel travel = new Travel();
                    travel.setId((Long) sourceAsMap.get("id"));
                    travel.setTitle((String) sourceAsMap.get("title"));
                    travel.setStartDate(LocalDate.parse((String) sourceAsMap.get("startDate"))); // 날짜 형식 변환
                    travel.setEndDate(LocalDate.parse((String) sourceAsMap.get("endDate"))); // 날짜 형식 변환
                    travel.setImage((String) sourceAsMap.get("image"));
                    travel.setMemberCount((Integer) sourceAsMap.get("memberCount"));

                    Country country = new Country();
                    country.setId((int) sourceAsMap.get("countryId"));
                    country.setName((String) sourceAsMap.get("countryName"));
                    country.setCurrency((String) sourceAsMap.get("currency"));
                    travel.setCountry(country);

                    return convertToTravelListResponse(travel); // Travel 객체를 TravelListResponse로 변환
                })
                .collect(Collectors.toList());

        return new PageImpl<>(travelListResponses, PageRequest.of(page, size), searchResponse.getHits().getTotalHits().value);
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
    private void saveTravelBudgets(TravelRequest request, Travel travel) {
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

    public void indexOrUpdateTravel(Travel travel) {
        String id = travel.getId().toString();

        // status가 true일 경우 데이터를 적재 또는 업데이트
        if (travel.isStatus()) {
            IndexQuery indexQuery = new IndexQueryBuilder()
                    .withId(id)
                    .withObject(travel)
                    .build();

            // 인덱스 좌표 추가 (예: "travel" 인덱스 이름 사용)
            elasticsearchTemplate.index(indexQuery, IndexCoordinates.of("travel"));
        }
        // status가 false일 경우 Elasticsearch에서 해당 데이터 삭제
        else {
            elasticsearchTemplate.delete(id, IndexCoordinates.of("travel"));
        }
    }

}
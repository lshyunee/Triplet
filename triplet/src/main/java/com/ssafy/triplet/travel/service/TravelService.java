package com.ssafy.triplet.travel.service;

import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import com.ssafy.triplet.travel.dto.request.TravelRequest;
import com.ssafy.triplet.travel.dto.request.TravelShareRequest;
import com.ssafy.triplet.travel.dto.response.TransactionListResponse;
import com.ssafy.triplet.travel.dto.response.TravelListResponse;
import com.ssafy.triplet.travel.dto.response.TravelResponse;
import com.ssafy.triplet.travel.entity.*;
import com.ssafy.triplet.travel.repository.*;
import com.ssafy.triplet.travel.util.InviteCodeGenerator;
import com.ssafy.triplet.travel.util.S3Service;
import lombok.RequiredArgsConstructor;
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
    private final TravelTransactionListRepository transactionListRepository;
    private final MerchantRepository merchantRepository;
    private final S3Service s3Service;

    @Transactional
    public TravelResponse createTravel(Long userId, TravelRequest request, MultipartFile image) throws IOException {
        validateTravelRequest(request);
        String inviteCode = InviteCodeGenerator.generateInviteCode();
        Travel travel = buildTravel(userId, request, image, inviteCode);
        Travel savedTravel = travelRepository.save(travel);
        insertTravelMembers(userId, travel.getId());
        saveTravelBudgets(request, savedTravel);
        return buildTravelResponse(savedTravel, inviteCode);
    }

//    여행 생성 시 계좌번호 생성
//    String walletNumber = "124-" + (1000 + new Random().nextInt(9000)) + "-1247";

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

    public List<TravelListResponse> getTravelOngoingList(Long userId) {
        LocalDate today = LocalDate.now();
        List<Travel> travelList = travelRepository.findOngoingTravelsByUserId(userId, today);
        List<TravelListResponse> responseList = new ArrayList<>();
        for (Travel travel : travelList) {
            responseList.add(convertToTravelListResponse(travel, userId));
        }
        return responseList;
    }

    public List<TravelListResponse> getTravelCompleteList(Long userId) {
        LocalDate today = LocalDate.now();
        List<Travel> travelList = travelRepository.findCompletedTravelsByUserId(userId, today);

        List<TravelListResponse> responseList = new ArrayList<>();
        for (Travel travel : travelList) {
            TravelListResponse response = convertToTravelListResponse(travel, userId);
            responseList.add(response);
        }

        return responseList;
    }

    public List<TravelListResponse> getTravelUpcomingList(Long userId) {
        LocalDate today = LocalDate.now();
        List<Travel> travelList = travelRepository.findUpcomingTravelsByUserId(userId, today);
        List<TravelListResponse> responseList = new ArrayList<>();
        for (Travel travel : travelList) {
            responseList.add(convertToTravelListResponse(travel, userId));
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
        return buildTravelResponse(travel, travel.getInviteCode());
    }

    public List<Country> countryList() {
        return countryRepository.findAll();
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
    private TravelListResponse convertToTravelListResponse(Travel travel, Long userId) {
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

    // 여행 지출 내역
    private TransactionListResponse convertToTransactionListResponse(TravelTransactionList travelTransactionList) {
        TransactionListResponse response = new TransactionListResponse();
        response.setTransactionId(travelTransactionList.getId());
        response.setPrice(travelTransactionList.getPrice());
        response.setTransactionDate(travelTransactionList.getTransactionDate().toInstant().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
        response.setCategoryName(categoryRepository.findCategoryNameByCategoryId(travelTransactionList.getCategory().getCategoryId()));
        response.setCategoryId(travelTransactionList.getCategory().getCategoryId());
        response.setMerchantName(merchantRepository.findMerchantNameById(travelTransactionList.getMerchantId()));
        response.setTravelId(travelTransactionList.getTravel().getId());
        response.setBalance(travelTransactionList.getBalance());
        return response;
    }
}
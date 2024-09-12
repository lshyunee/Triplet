package com.ssafy.triplet.travel.service;

import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.travel.dto.request.TravelRegisterRequest;
import com.ssafy.triplet.travel.dto.response.TravelRegisterResponse;
import com.ssafy.triplet.travel.entity.Country;
import com.ssafy.triplet.travel.entity.Travel;
import com.ssafy.triplet.travel.entity.TravelBudget;
import com.ssafy.triplet.travel.repository.CategoryRepository;
import com.ssafy.triplet.travel.repository.CountryRepository;
import com.ssafy.triplet.travel.repository.TravelBudgetRepository;
import com.ssafy.triplet.travel.repository.TravelRepository;
import com.ssafy.triplet.travel.util.InviteCodeGenerator;
import com.ssafy.triplet.travel.util.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TravelServiceImpl implements TravelService {
    private final TravelRepository travelRepository;
    private final TravelBudgetRepository travelBudgetRepository;
    private final CategoryRepository categoryRepository;
    private final CountryRepository countryRepository;
    private final S3Service s3Service;

    @Override
    public TravelRegisterResponse createTravel(TravelRegisterRequest request, MultipartFile image) throws IOException {
        validateTravelRequest(request);
        Travel travel = buildTravel(request, image);
        Travel savedTravel = travelRepository.save(travel);
        saveTravelBudgets(request, savedTravel);
        return buildTravelRegisterResponse(savedTravel, request.getMemberCount());
    }

    // 필수 값 및 날짜 검증 메서드 (여행 생성)
    private void validateTravelRequest(TravelRegisterRequest request) {
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
            throw new CustomException("T0004", "종료일은 시작일보다 이후여야 합니다.");
        }
    }

    // Travel 객체 생성 메서드 (여행 생성)
    private Travel buildTravel(TravelRegisterRequest request, MultipartFile image) throws IOException {
        Travel travel = new Travel();
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
                .orElseThrow(() -> new IllegalArgumentException("국가를 찾을 수 없습니다."));
        travel.setCountry(country);

        travel.setCreatorId(1L);
        return travel;
    }

    // TravelBudget 저장 메서드 (여행 생성)
    private void saveTravelBudgets(TravelRegisterRequest request, Travel travel) {
        for (TravelRegisterRequest.BudgetDTO budgetDTO : request.getBudgets()) {
            TravelBudget travelBudget = new TravelBudget();
            travelBudget.setCategory(categoryRepository.findById(budgetDTO.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found")));
            travelBudget.setCategoryBudget(budgetDTO.getBudget());
            travelBudget.setBudgetWon(budgetDTO.getBudgetWon());
            travelBudget.setTravel(travel);
            travelBudgetRepository.save(travelBudget);
        }
    }

    // 응답 생성 메서드 (여행 생성)
    private TravelRegisterResponse buildTravelRegisterResponse(Travel travel, int memberCount) {
        TravelRegisterResponse response = new TravelRegisterResponse();

        if (memberCount >= 2) {
            String inviteCode = InviteCodeGenerator.generateInviteCode();
            response.setInviteCode(inviteCode);
        }

        String walletNumber = "312-" + (1000 + new Random().nextInt(9000)) + "-0093";
        response.setWalletAccountNumber(walletNumber);
        response.setCountry(travel.getCountry().getName());
        response.setStartDate(travel.getStartDate());
        response.setEndDate(travel.getEndDate());
        response.setTitle(travel.getTitle());
        response.setImage(travel.getImage());
        response.setMemberCount(travel.getMemberCount());
        response.setTotalBudget(travel.getTotalBudget());

        List<TravelBudget> savedBudgets = travelBudgetRepository.findByTravel(travel);
        response.setBudgets(
                savedBudgets.stream()
                        .map(travelBudget -> new TravelRegisterResponse.BudgetDTO(
                                travelBudget.getCategory().getCategoryId(),
                                travelBudget.getCategoryBudget(),
                                travelBudget.getBudgetWon()))
                        .collect(Collectors.toList())
        );

        return response;
    }
}


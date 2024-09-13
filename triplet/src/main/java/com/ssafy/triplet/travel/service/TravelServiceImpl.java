package com.ssafy.triplet.travel.service;

import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.travel.dto.request.TravelRequest;
import com.ssafy.triplet.travel.dto.response.TravelResponse;
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
    public TravelResponse createTravel(TravelRequest request, MultipartFile image) throws IOException {
        validateTravelRequest(request);
        Travel travel = buildTravel(request, image);
        Travel savedTravel = travelRepository.save(travel);
        saveTravelBudgets(request, savedTravel);
        return buildTravelResponse(savedTravel, request.getMemberCount());
    }

//    여행 생성 시 계좌번호 생성
//    String walletNumber = "124-" + (1000 + new Random().nextInt(9000)) + "-1247";

    @Override
    public TravelResponse updateTravel(Long travelId, TravelRequest request, MultipartFile image) throws IOException {
        validateTravelRequest(request);

        Travel travel = travelRepository.findById(travelId)
                .orElseThrow(() -> new CustomException("T0005", "해당 여행을 찾을 수 없습니다."));

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

        return buildTravelResponse(updatedTravel, request.getMemberCount());
    }

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
    private Travel buildTravel(TravelRequest request, MultipartFile image) throws IOException {
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
                .orElseThrow(() -> new CustomException("T0006", "국가를 찾을 수 없습니다."));
        travel.setCountry(country);

        travel.setCreatorId(1L);
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
    private TravelResponse buildTravelResponse(Travel travel, int memberCount) {
        TravelResponse response = new TravelResponse();

        if (memberCount >= 2) {
            String inviteCode = InviteCodeGenerator.generateInviteCode();
            response.setInviteCode(inviteCode);
        }

        response.setTravelId(travel.getId());
        response.setCountry(travel.getCountry().getName());
        response.setCountryId(travel.getCountry().getId());
        response.setStartDate(travel.getStartDate());
        response.setEndDate(travel.getEndDate());
        response.setTitle(travel.getTitle());
        response.setImage(travel.getImage());
        response.setMemberCount(travel.getMemberCount());
        response.setTotalBudget(travel.getTotalBudget());

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


}


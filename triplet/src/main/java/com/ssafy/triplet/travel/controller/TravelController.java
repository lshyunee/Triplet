package com.ssafy.triplet.travel.controller;

import com.ssafy.triplet.auth.dto.CustomUserPrincipal;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.repository.MemberRepository;
import com.ssafy.triplet.member.service.MemberService;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.travel.dto.request.TravelCreateRequest;
import com.ssafy.triplet.travel.dto.request.TravelRequest;
import com.ssafy.triplet.travel.dto.request.TravelShareRequest;
import com.ssafy.triplet.travel.dto.response.*;
import com.ssafy.triplet.travel.service.TravelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/travels")
@RequiredArgsConstructor
public class TravelController {

    private final TravelService travelService;
    private final MemberRepository memberRepository;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<TravelResponse>> createTravel(
            @AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
            @RequestPart("data") TravelCreateRequest requestDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            TravelResponse responseDTO = travelService.createTravel(userId, requestDTO, image);
            return ResponseEntity.ok(new ApiResponse<>("200", "여행이 생성되었습니다.", responseDTO));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<TravelResponse>> updateTravel(
            @AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
            @RequestPart("data") TravelRequest requestDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            TravelResponse responseDTO = travelService.updateTravel(requestDTO, image, userId);
            return ResponseEntity.ok(new ApiResponse<>("200", "여행이 수정되었습니다.", responseDTO));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @DeleteMapping("/delete/{travelId}")
    public ResponseEntity<ApiResponse<TravelResponse>> deleteTravel(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
                                                                    @PathVariable Long travelId) {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            travelService.deleteTravel(travelId, userId);
            return ResponseEntity.ok(new ApiResponse<>("200", "여행이 삭제되었습니다."));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/ongoing")
    public ResponseEntity<ApiResponse<TravelListResponse>> ongoingTravel(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            TravelListResponse responseList = travelService.getTravelOngoingList(userId);
            if (responseList == null) {
                return ResponseEntity.ok(new ApiResponse<>("200", "진행중인 여행이 없습니다."));
            }
            return ResponseEntity.ok(new ApiResponse<>("200", "진행중인 여행이 조회되었습니다.", responseList));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/completed")
    public ResponseEntity<ApiResponse<List<TravelListResponse>>> completedTravel(
            @AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            List<TravelListResponse> responseList = travelService.getTravelCompleteList(userId);

            if (responseList.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>("200", "완료된 여행이 없습니다."));
            }

            return ResponseEntity.ok(new ApiResponse<>("200", "완료된 여행이 조회되었습니다.", responseList));
        } catch (CustomException customException) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(customException.getErrorCode(), customException.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("E0000", "서버 에러가 발생했습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<TravelListResponse>>> upcomingTravel(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal) {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            List<TravelListResponse> responseList = travelService.getTravelUpcomingList(userId);
            if (responseList.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>("200", "다가오는 여행이 없습니다."));
            }
            return ResponseEntity.ok(new ApiResponse<>("200", "다가오는 여행이 조회되었습니다.", responseList));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/{travelId}")
    public ResponseEntity<ApiResponse<TravelResponse>> getReadTravel(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
                                                                     @PathVariable Long travelId) {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            TravelResponse responseDTO = travelService.getTravel(travelId, userId);
            return ResponseEntity.ok(new ApiResponse<>("200", "여행이 조회되었습니다.", responseDTO));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping("/share")
    public ResponseEntity<ApiResponse<TravelResponse>> shareTravel(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
                                                                   @RequestBody TravelShareRequest requestDTO) {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            travelService.postTravel(userId, requestDTO);
            return ResponseEntity.ok(new ApiResponse<>("200", "여행 공유 상태가 변경되었습니다."));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping("/invite/{inviteCode}")
    public ResponseEntity<ApiResponse<TravelResponse>> inviteAddTravel(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
                                                                       @PathVariable String inviteCode) {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            TravelResponse travel = travelService.inviteTravel(inviteCode, userId);
            return ResponseEntity.ok(new ApiResponse<>("200", "여행에 새로운 멤버가 추가되었습니다.", travel));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/countries")
    public ResponseEntity<ApiResponse<List<CountryResponse>>> getCountries() {
        try {
            List<CountryResponse> list = travelService.countryList();
            return ResponseEntity.ok(new ApiResponse<>("200", "국가 리스트가 조회되었습니다.", list));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getCategories() {
        try {
            List<CategoryResponse> list = travelService.getCategoryList();
            return ResponseEntity.ok(new ApiResponse<>("200", "카테고리 리스트가 조회되었습니다.", list));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/expenditure-expenses/{travelId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getExpenditureExpenses(@PathVariable Long travelId) {
        try {
            Map<String, Object> response = travelService.getTravelBudgetList(travelId);
            return ResponseEntity.ok(new ApiResponse<>("200", "카테고리별 지출현황이 조회되었습니다.", response));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping("/leave/{travelId}")
    public ResponseEntity<ApiResponse<TravelResponse>> leaveTravel(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
                                                                   @PathVariable Long travelId) {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            travelService.leaveTravel(userId, travelId);
            return ResponseEntity.ok(new ApiResponse<>("200", "유저가 여행에서 떠났습니다."));
        } catch (Exception e) {
            return handleException(e);
        }
    }


    // 테스트용 메서드
    @PostMapping("/finish/{travelId}")
    public ResponseEntity<ApiResponse<TravelResponse>> finishTravel(@PathVariable Long travelId) {
        try {
            travelService.finishTravel(travelId);
            return ResponseEntity.ok(new ApiResponse<>("200", "여행이 종료되었습니다."));
        } catch (Exception e) {
            return handleException(e);
        }
    }


    // 예외처리 메서드
    private <T> ResponseEntity<ApiResponse<T>> handleException(Exception e) {
        if (e instanceof CustomException customException) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(customException.getErrorCode(), customException.getMessage()));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("E0000", "서버 에러가 발생했습니다." + e.getMessage()));
        }
    }

}
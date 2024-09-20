package com.ssafy.triplet.travel.controller;

import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.travel.dto.request.TravelRequest;
import com.ssafy.triplet.travel.dto.request.TravelShareRequest;
import com.ssafy.triplet.travel.dto.response.TravelListResponse;
import com.ssafy.triplet.travel.dto.response.TravelResponse;
import com.ssafy.triplet.travel.entity.TravelFolder;
import com.ssafy.triplet.travel.service.TravelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<TravelResponse>> createTravel(
            @CookieValue(name = "accessToken", required = false) String token,
            @RequestPart("data") TravelRequest requestDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        try {
            Long userId = extractAndValidateUser(token);  // 토큰과 회원 확인 로직 호출
            TravelResponse responseDTO = travelService.createTravel(userId, requestDTO, image);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "여행이 생성되었습니다.", responseDTO));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PutMapping("/update/{travelId}")
    public ResponseEntity<ApiResponse<TravelResponse>> updateTravel(
            @CookieValue(name = "accessToken", required = false) String token,
            @PathVariable Long travelId,
            @RequestPart("data") TravelRequest requestDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
        try {
            Long userId = extractAndValidateUser(token);
            TravelResponse responseDTO = travelService.updateTravel(travelId, requestDTO, image, userId);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "여행이 수정되었습니다.", responseDTO));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @DeleteMapping("/delete/{travelId}")
    public ResponseEntity<ApiResponse<TravelResponse>> deleteTravel(@CookieValue(name = "accessToken", required = false) String token,
                                                                    @PathVariable Long travelId) {
        try {
            Long userId = extractAndValidateUser(token);
            travelService.deleteTravel(travelId, userId);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "여행이 삭제되었습니다."));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/ongoing")
    public ResponseEntity<ApiResponse<List<TravelListResponse>>> ongoingTravel(@CookieValue(name = "accessToken", required = false) String token) {
        try {
            Long userId = extractAndValidateUser(token);
            List<TravelListResponse> responseList = travelService.getTravelOngoingList(userId);
            if (responseList.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "진행중인 여행이 없습니다."));
            }
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "진행중인 여행이 조회되었습니다.", responseList));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/completed")
    public ResponseEntity<ApiResponse<Map<String, List<TravelListResponse>>>> completedTravel(
            @CookieValue(name = "accessToken", required = false) String token) {
        try {
            Long userId = extractAndValidateUser(token);
            Map<String, List<TravelListResponse>> responseList = travelService.getTravelCompleteList(userId);

            if (responseList.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "완료된 여행이 없습니다."));
            }

            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "완료된 여행이 조회되었습니다.", responseList));
        } catch (CustomException customException) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(customException.getErrorCode(), customException.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("E0000", "서버 에러가 발생했습니다: " + e.getMessage()));
        }
    }

    @GetMapping("/upcoming")
    public ResponseEntity<ApiResponse<List<TravelListResponse>>> upcomingTravel(@CookieValue(name = "accessToken", required = false) String token) {
        try {
            Long userId = extractAndValidateUser(token);
            List<TravelListResponse> responseList = travelService.getTravelUpcomingList(userId);
            if (responseList.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "다가오는 여행이 없습니다."));
            }
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "다가오는 여행이 조회되었습니다.", responseList));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @GetMapping("/{travelId}")
    public ResponseEntity<ApiResponse<TravelResponse>> getReadTravel(@CookieValue(name = "accessToken", required = false) String token,
                                                                     @PathVariable Long travelId) {
        try {
            Long userId = extractAndValidateUser(token);
            TravelResponse responseDTO = travelService.getTravel(travelId, userId);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "여행이 조회되었습니다.", responseDTO));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping("/share")
    public ResponseEntity<ApiResponse<TravelResponse>> shareTravel(@CookieValue(name = "accessToken", required = false) String token,
                                                                   @RequestBody TravelShareRequest requestDTO) {
        try {
            Long userId = extractAndValidateUser(token);
            travelService.postTravel(userId, requestDTO);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "여행 공유 상태가 변경되었습니다."));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping("/folder/create")
    public ResponseEntity<ApiResponse<TravelFolder>> createFolder(@CookieValue(name = "accessToken", required = false) String token,
                                                                  @RequestBody TravelFolder travelFolder) {
        try {
//            if (token == null) {
//                throw new CustomException("M0011", "토큰이 비어있습니다.");
//            }
            TravelFolder result = travelService.addFolder(travelFolder.getFolderTitle());
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "폴더가 생성되었습니다.", result));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @PostMapping("/folder/travel-add/{folderId}/{travelId}")
    public ResponseEntity<ApiResponse<TravelFolder>> addTravelInFolder(@CookieValue(name = "accessToken", required = false) String token,
                                                                  @PathVariable Long folderId, @PathVariable Long travelId) {
        try {
            Long userId = extractAndValidateUser(token);
            travelService.addTravelFolder(folderId, travelId, userId);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "폴더에 여행이 추가되었습니다."));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @DeleteMapping("/folder/travel-delete/{travelId}")
    public ResponseEntity<ApiResponse<TravelFolder>> deleteTravelInFolder(@CookieValue(name = "accessToken", required = false) String token,
                                                                          @PathVariable Long travelId) {
        try {
            Long userId = extractAndValidateUser(token);
            travelService.removeFolderInTravel(travelId, userId);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "폴더에서 여행이 삭제되었습니다."));
        } catch (Exception e) {
            return handleException(e);
        }
    }

    @DeleteMapping("/folder/delete/{folderId}")
    public ResponseEntity<ApiResponse<Void>> deleteFolder(@CookieValue(name = "accessToken", required = false) String token,
                                                          @PathVariable Long folderId) {
        try {
//            if (token == null) {
//                throw new CustomException("M0011", "토큰이 비어있습니다.");
//            }
            travelService.removeFolder(folderId);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "폴더가 삭제되었습니다."));
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


    // 토큰 및 회원 확인 메서드
    private Long extractAndValidateUser(String token) throws CustomException {
//        if (token == null) {
//            throw new CustomException("M0011", "토큰이 비어있습니다.");
//        }
//        long userId = jwtUtil.extractUserId(token.substring(7));
//        MemberResponse member = memberService.getMemberById(userId);
//        if (member == null) {
//            throw new CustomException("M0010", "존재하지 않는 회원입니다.");
//        }
        Long userId = 1L;
        return userId;
    }
}
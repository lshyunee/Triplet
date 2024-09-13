package com.ssafy.triplet.travel.controller;

import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.travel.dto.request.TravelRequest;
import com.ssafy.triplet.travel.dto.response.TravelResponse;
import com.ssafy.triplet.travel.service.TravelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/travel")
@RequiredArgsConstructor
public class TravelController {

    private final TravelService travelService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<TravelResponse>> createTravel(
            @RequestPart("data") TravelRequest requestDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        try {
            TravelResponse responseDTO = travelService.createTravel(requestDTO, image);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "여행이 생성되었습니다.", responseDTO));
        } catch (CustomException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getErrorCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("E0000", "서버 에러가 발생했습니다."));
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ApiResponse<TravelResponse>> updateTravel(
            @PathVariable Long id,
            @RequestPart("data") TravelRequest requestDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        try {
            TravelResponse responseDTO = travelService.updateTravel(id, requestDTO, image);
            return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.toString(), "여행이 수정되었습니다.", responseDTO));
        } catch (CustomException e) {
            return ResponseEntity.badRequest().body(new ApiResponse<>(e.getErrorCode(), e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("E0000", "서버 에러가 발생했습니다."));
        }
    }

}
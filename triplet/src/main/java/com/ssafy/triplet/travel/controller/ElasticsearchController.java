package com.ssafy.triplet.travel.controller;

import com.ssafy.triplet.auth.dto.CustomUserPrincipal;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.repository.MemberRepository;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.travel.dto.response.TravelFeedListResponse;
import com.ssafy.triplet.travel.dto.response.TravelListPagedResponse;
import com.ssafy.triplet.travel.service.ElasticsearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/travels/shared")
@RequiredArgsConstructor
public class ElasticsearchController {

    private final MemberRepository memberRepository;
    private final ElasticsearchService elasticsearchService;

    @GetMapping
    public ResponseEntity<ApiResponse<TravelListPagedResponse>> getTravelList(@AuthenticationPrincipal CustomUserPrincipal customUserPrincipal,
                                                                              @RequestParam(required = false) String countryName,
                                                                              @RequestParam(required = false) Integer memberCount,
                                                                              @RequestParam(required = false) Double minBudget,
                                                                              @RequestParam(required = false) Double maxBudget,
                                                                              @RequestParam(required = false) Integer minDays,
                                                                              @RequestParam(required = false) Integer maxDays,
                                                                              @RequestParam(defaultValue = "0") int kind,
                                                                              @RequestParam(defaultValue = "1") int page) {
        try {
            Long userId = memberRepository.findIdByMemberId(customUserPrincipal.getMemberId());
            Page<TravelFeedListResponse> travelList = elasticsearchService.getTravelSNSList(userId, countryName, memberCount, minBudget, maxBudget, minDays, maxDays, page, kind, 10);
            TravelListPagedResponse pagedResponse = elasticsearchService.toPagedResponse(travelList);
            if (travelList.isEmpty()) {
                return ResponseEntity.ok(new ApiResponse<>("200", "게시글이 없습니다."));
            }
            return ResponseEntity.ok(new ApiResponse<>("200", "게시글 리스트가 조회되었습니다.", pagedResponse));
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

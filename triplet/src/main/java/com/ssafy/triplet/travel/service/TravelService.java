package com.ssafy.triplet.travel.service;

import com.ssafy.triplet.travel.dto.request.TravelRequest;
import com.ssafy.triplet.travel.dto.response.TravelListResponse;
import com.ssafy.triplet.travel.dto.response.TravelResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface TravelService {
  TravelResponse createTravel(Long userId, TravelRequest requestDTO, MultipartFile image) throws IOException;
  TravelResponse updateTravel(Long travelId, TravelRequest requestDTO, MultipartFile image, Long userId) throws IOException;
  void deleteTravel(Long travelId, Long userId);
  List<TravelListResponse> getTravelOngoingList(Long userId);
  Map<String, List<TravelListResponse>> getTravelCompleteList(Long userId);
  List<TravelListResponse> getTravelUpcomingList(Long userId);
  TravelResponse getTravel(Long travelId);
}

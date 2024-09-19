package com.ssafy.triplet.travel.service;

import com.ssafy.triplet.travel.dto.request.TravelRequest;
import com.ssafy.triplet.travel.dto.response.TravelListResponse;
import com.ssafy.triplet.travel.dto.response.TravelResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface TravelService {
  TravelResponse createTravel(Long userId, TravelRequest requestDTO, MultipartFile image) throws IOException;
  TravelResponse updateTravel(Long travelId, TravelRequest requestDTO, MultipartFile image) throws IOException;
  void deleteTravel(Long travelId);
  List<TravelListResponse> getTravelOngoingList(Long userId);
  List<TravelListResponse> getTravelCompleteList(Long userId);
}

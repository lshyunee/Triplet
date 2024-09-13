package com.ssafy.triplet.travel.service;

import com.ssafy.triplet.travel.dto.request.TravelRequest;
import com.ssafy.triplet.travel.dto.response.TravelResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface TravelService {
  TravelResponse createTravel(TravelRequest requestDTO, MultipartFile image) throws IOException;
  TravelResponse updateTravel(Long travelId, TravelRequest requestDTO, MultipartFile image) throws IOException;
}

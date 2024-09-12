package com.ssafy.triplet.travel.service;

import com.ssafy.triplet.travel.dto.request.TravelRegisterRequest;
import com.ssafy.triplet.travel.dto.response.TravelRegisterResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface TravelService {
  TravelRegisterResponse createTravel(TravelRegisterRequest requestDTO, MultipartFile image) throws IOException;
}

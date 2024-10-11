package com.ssafy.triplet.travel.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class CountryResponse {
    private int countryId;
    private String countryName;
    private String currency;
}

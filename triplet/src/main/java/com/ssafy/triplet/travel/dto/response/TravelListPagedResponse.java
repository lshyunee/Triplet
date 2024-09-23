package com.ssafy.triplet.travel.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class TravelListPagedResponse {
    private List<TravelListResponse> content;
    private int pageNumber;
    private boolean last;
    private int totalPages;
    private long totalElements;
    private int number;
}

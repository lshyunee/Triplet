package com.ssafy.triplet.travel.service;

import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQuery;
import co.elastic.clients.json.JsonData;
import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.travel.dto.response.TravelFeedListResponse;
import com.ssafy.triplet.travel.dto.response.TravelListPagedResponse;
import com.ssafy.triplet.travel.repository.CountryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ElasticsearchService {
    private final ElasticsearchOperations elasticsearchOperations;
    private final CountryRepository countryRepository;

    public Page<TravelFeedListResponse> getTravelSNSList(Long userId, String countryName, Integer memberCount, Double minBudget, Double maxBudget,
                                                         Integer minDays, Integer maxDays, int page, int kind, int pageSize) {
        try {
            BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();

            if (countryName != null && !countryName.isEmpty()) {
                int countryId = countryRepository.findIdByCountryName(countryName);
                boolQueryBuilder.must(Query.of(q -> q.term(t -> t.field("country_id").value(countryId))));
            }
            if (memberCount != null) {
                boolQueryBuilder.must(Query.of(q -> q.term(t -> t.field("member_count").value(memberCount))));
            }
            if (minBudget != null || maxBudget != null) {
                RangeQuery.Builder budgetRangeQuery = new RangeQuery.Builder().field("total_budget_won");
                if (minBudget != null) {
                    budgetRangeQuery.gte(JsonData.of(minBudget));
                }
                if (maxBudget != null) {
                    budgetRangeQuery.lte(JsonData.of(maxBudget));
                }
                boolQueryBuilder.must(Query.of(q -> q.range(budgetRangeQuery.build())));
            }
            if (minDays != null || maxDays != null) {
                RangeQuery.Builder daysRangeQuery = new RangeQuery.Builder().field("days");
                if (minDays != null) {
                    daysRangeQuery.gte(JsonData.of(minDays));
                }
                if (maxDays != null) {
                    daysRangeQuery.lte(JsonData.of(maxDays));
                }
                boolQueryBuilder.must(Query.of(q -> q.range(daysRangeQuery.build())));
            }


            // BoolQuery를 빌드하여 Query로 변환
            Query boolQuery = Query.of(q -> q.bool(boolQueryBuilder.build()));
            // Elasticsearch 검색 요청 생성
            NativeQuery searchQuery = NativeQuery.builder()
                    .withQuery(boolQuery)
                    .withPageable(PageRequest.of(page - 1, pageSize))
                    .build();

            // Elasticsearch 검색 실행
            SearchHits<TravelFeedListResponse> searchHits = elasticsearchOperations.search(searchQuery, TravelFeedListResponse.class);
            // 결과 파싱
            List<TravelFeedListResponse> searchResults = searchHits.getSearchHits().stream()
                    .map(SearchHit::getContent)
                    .collect(Collectors.toList());

            // 결과 페이지네이션 처리
            Page<TravelFeedListResponse> result = new PageImpl<>(searchResults, PageRequest.of((page - 1), pageSize), searchHits.getTotalHits());
            return result;
        } catch (Exception e) {
            throw new CustomException(CustomErrorCode.ELASTICSEARCH_ERROR);
        }
    }

    public TravelListPagedResponse toPagedResponse(Page<TravelFeedListResponse> page) {
        TravelListPagedResponse response = new TravelListPagedResponse();
        response.setContent(page.getContent());
        response.setPageNumber((page.getNumber() + 1));
        response.setLast(page.isLast());
        response.setTotalPages(page.getTotalPages());
        response.setTotalElements(page.getTotalElements());
        return response;
    }
}

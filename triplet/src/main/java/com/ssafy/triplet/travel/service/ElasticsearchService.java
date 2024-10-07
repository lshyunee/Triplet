package com.ssafy.triplet.travel.service;

import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQuery;
import co.elastic.clients.json.JsonData;
import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.travel.dto.request.MemberDocument;
import com.ssafy.triplet.travel.dto.response.TravelFeedListResponse;
import com.ssafy.triplet.travel.dto.response.TravelListPagedResponse;
import com.ssafy.triplet.travel.entity.Travel;
import com.ssafy.triplet.travel.repository.CountryRepository;
import com.ssafy.triplet.travel.repository.ElasticSearchRepository;
import com.ssafy.triplet.travel.repository.TravelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ElasticsearchService {
    private final ElasticsearchOperations elasticsearchOperations;
    private final CountryRepository countryRepository;
    private final TravelRepository travelRepository;
    private final ElasticSearchRepository elasticSearchRepository;

    public Page<TravelFeedListResponse> getTravelSNSList(Long userId, String countryName, Integer memberCount, Double minBudget, Double maxBudget,
                                                         Integer minDays, Integer maxDays, int page, int kind, int pageSize) {
//        try {
        BoolQuery.Builder boolQueryBuilder = buildCommonQuery(userId);

        if (kind == 0) {
            recommendedTravel(boolQueryBuilder, userId);
            return executeSearch(boolQueryBuilder, page, pageSize);
        } else if (kind == 1) {
            return latestTravel(userId, page, pageSize);
        } else if (kind == 2) {
            searchTravel(boolQueryBuilder, countryName, memberCount, minBudget, maxBudget, minDays, maxDays);
            return executeSearch(boolQueryBuilder, page, pageSize);
        } else {
            throw new CustomException(CustomErrorCode.INVALID_KIND_ERROR);
        }

//        } catch (Exception e) {
//            throw new CustomException(CustomErrorCode.ELASTICSEARCH_ERROR);
//        }
    }

    // 빌드 메서드
    private BoolQuery.Builder buildCommonQuery(Long userId) {
        BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();

        List<String> userTravelIds = getUserTravelIds(userId); // 사용자의 travelId 목록을 가져오는 메서드

        List<FieldValue> userTravelIdFieldValues = userTravelIds.stream()
                .map(Long::valueOf)
                .map(FieldValue::of)
                .collect(Collectors.toList());

        boolQueryBuilder.must(Query.of(q -> q.term(t -> t.field("status").value(true))));
        boolQueryBuilder.must(Query.of(q -> q.term(t -> t.field("is_shared").value(true))));
        if (!userTravelIdFieldValues.isEmpty()) {
            boolQueryBuilder.mustNot(Query.of(q -> q.terms(t -> t.field("id").terms(v -> v.value(userTravelIdFieldValues)))));
        }

        return boolQueryBuilder;
    }

    private List<String> getUserTravelIds(Long userId) {
        List<String> userTravels = new ArrayList<>();

        Query userQuery = Query.of(q -> q.term(t -> t.field("id").value(userId)));
        SearchHits<MemberDocument> userSearchHits = elasticsearchOperations.search(
                NativeQuery.builder().withQuery(userQuery).build(),
                MemberDocument.class
        );
        if (!userSearchHits.getSearchHits().isEmpty()) {
            MemberDocument user = userSearchHits.getSearchHits().get(0).getContent();
            userTravels = user.getTravels() != null ? user.getTravels() : new ArrayList<>();
        }
        return userTravels; // userId에 해당하는 travels 필드 값
    }



    // kind = 0 (추천)
    private void recommendedTravel(BoolQuery.Builder boolQueryBuilder, Long userId) {
        Query userQuery = Query.of(q -> q.term(t -> t.field("id").value(userId)));
        SearchHits<MemberDocument> userSearchHits = elasticsearchOperations.search(
                NativeQuery.builder().withQuery(userQuery).build(),
                MemberDocument.class
        );

        // 유저 정보 가져오기
        if (!userSearchHits.getSearchHits().isEmpty()) {
            MemberDocument user = userSearchHits.getSearchHits().get(0).getContent();
            int age = user.getAge();
            int gender = user.getGender();

            // travels 필드에서 사용자가 이미 다녀온 travelId 리스트 가져오기
            List<String> userTravels = user.getTravels() != null ? user.getTravels() : new ArrayList<>();

            // travels의 travelId에 해당하는 country_id 조회
            List<Integer> excludedCountryIds = new ArrayList<>();
            for (String travelId : userTravels) {
                // travelId로 travel 인덱스에서 country_id 조회
                Query travelQuery = Query.of(q -> q.term(t -> t.field("id").value(travelId)));
                SearchHits<TravelFeedListResponse> travelSearchHits = elasticsearchOperations.search(
                        NativeQuery.builder().withQuery(travelQuery).build(),
                        TravelFeedListResponse.class
                );

                // 조회된 country_id 저장
                travelSearchHits.getSearchHits().forEach(hit -> {
                    Integer countryId = hit.getContent().getCountryId();
                    if (countryId != null) {
                        excludedCountryIds.add(countryId);
                    }
                });
            }

            // 나이와 성별로 유사한 사용자 검색
            BoolQuery.Builder similarUserQueryBuilder = new BoolQuery.Builder();
            int ageLowerBound = (age / 10) * 10;
            int ageUpperBound = ageLowerBound + 9;
            similarUserQueryBuilder.must(Query.of(q -> q.range(r -> r.field("age").gte(JsonData.of(ageLowerBound)).lte(JsonData.of(ageUpperBound)))));
            similarUserQueryBuilder.must(Query.of(q -> q.term(t -> t.field("gender").value(gender))));

            // 유사한 사용자들의 검색 실행
            SearchHits<MemberDocument> similarUsersSearchHits = elasticsearchOperations.search(
                    NativeQuery.builder().withQuery(Query.of(q -> q.bool(similarUserQueryBuilder.build()))).build(),
                    MemberDocument.class
            );

            // 유사한 사용자들의 travels 필드에서 FieldValue로 변환 후 추출
            List<FieldValue> allTravelIds = similarUsersSearchHits.getSearchHits().stream()
                    .flatMap(hit -> {
                        List<String> travels = hit.getContent().getTravels();
                        return travels != null ? travels.stream() : Stream.empty();
                    })
                    .map(travelId -> {
                        try {
                            Long travelIdLong = Long.parseLong(travelId);
                            return FieldValue.of(travelIdLong);
                        } catch (NumberFormatException e) {
                            System.out.println("변환 오류: " + travelId);
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());

            // 한 번의 쿼리로 모든 travelId에 해당하는 country_id 조회
            SearchHits<TravelFeedListResponse> travelDocuments = elasticsearchOperations.search(
                    NativeQuery.builder().withQuery(Query.of(q -> q.terms(t -> t.field("id").terms(terms -> terms.value(allTravelIds))))).build(),
                    TravelFeedListResponse.class
            );

            // travelId와 해당하는 country_id 매핑
            Map<Long, Integer> travelIdToCountryIdMap = travelDocuments.getSearchHits().stream()
                    .collect(Collectors.toMap(hit -> hit.getContent().getId(), hit -> hit.getContent().getCountryId()));

            // 유사한 사용자들의 travels 필드에서 겹치는 여행지 필터링 및 그룹화
            Map<FieldValue, Long> travelFrequency = allTravelIds.stream()
                    // 제외할 country_id가 포함된 여행지 필터링
                    .filter(travelId -> {
                        Integer countryId = travelIdToCountryIdMap.get(travelId);
                        return countryId != null && !excludedCountryIds.contains(countryId);
                    })
                    .collect(Collectors.groupingBy(travelId -> travelId, Collectors.counting()));

            // 겹치는 여행지 순으로 정렬 (빈도수가 높은 순서대로)
            List<FieldValue> recommendedTravels = travelFrequency.entrySet().stream()
                    .sorted(Map.Entry.<FieldValue, Long>comparingByValue().reversed())
                    .map(entry -> FieldValue.of(entry.getKey()))
                    .collect(Collectors.toList());

            // 추천된 여행지 travel 인덱스에서 검색
            if (!recommendedTravels.isEmpty()) {
                BoolQuery.Builder travelSearchQuery = new BoolQuery.Builder();
                travelSearchQuery.must(Query.of(q -> q.terms(t -> t.field("id").terms(terms -> terms.value(recommendedTravels)))));

                // travel 인덱스에서 검색 실행
                SearchHits<TravelFeedListResponse> travelSearchHits = elasticsearchOperations.search(
                        NativeQuery.builder().withQuery(Query.of(q -> q.bool(travelSearchQuery.build()))).build(),
                        TravelFeedListResponse.class
                );

                // 검색된 여행지를 BoolQuery에 추가
                List<FieldValue> foundTravelIds = travelSearchHits.getSearchHits().stream()
                        .map(hit -> FieldValue.of(hit.getContent().getId().toString()))
                        .collect(Collectors.toList());

                if (!foundTravelIds.isEmpty()) {
                    boolQueryBuilder.must(Query.of(q -> q.terms(t -> t.field("id").terms(terms -> terms.value(foundTravelIds)))));
                }
            }
        }
    }


    // kind = 1 (최근) (elasticsearch X)
    public Page<TravelFeedListResponse> latestTravel(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of((page - 1), size);

        Page<Travel> travel = travelRepository.findAllTravel(userId, pageable);
        System.out.println(travel.getSize());

        List<TravelFeedListResponse> responseList = travel.getContent().stream()
                .map(this::convertToTravelFeedListResponse)
                .collect(Collectors.toList());

        return new PageImpl<>(responseList, pageable, travel.getTotalElements());
    }


    // kind = 2 (검색)
    private void searchTravel(BoolQuery.Builder boolQueryBuilder, String countryName, Integer memberCount, Double minBudget, Double maxBudget,
                              Integer minDays, Integer maxDays) {
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
    }

    // Elasticsearch 검색 실행
    private Page<TravelFeedListResponse> executeSearch(BoolQuery.Builder boolQueryBuilder, int page, int pageSize) {
        Query boolQuery = Query.of(q -> q.bool(boolQueryBuilder.build()));

        // Elasticsearch 검색 요청 생성
        NativeQuery searchQuery = NativeQuery.builder()
                .withQuery(boolQuery)
                .withPageable(PageRequest.of(page - 1, pageSize))
                .build();

        // Elasticsearch 검색 실행
        SearchHits<TravelFeedListResponse> searchHits = elasticsearchOperations.search(searchQuery, TravelFeedListResponse.class);

        List<TravelFeedListResponse> searchResults = searchHits.getSearchHits().stream()
                .map(hit -> {
                    TravelFeedListResponse response = hit.getContent();
                    if (response.getCountryId() != 0) {
                        String countryName = countryRepository.findNameById(response.getCountryId());
                        response.setCountryName(countryName);
                    }
                    return response;
                })
                .collect(Collectors.toList());

        // 결과 페이지네이션 처리
        return new PageImpl<>(searchResults, PageRequest.of(page - 1, pageSize), searchHits.getTotalHits());
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

    private TravelFeedListResponse convertToTravelFeedListResponse(Travel travel) {
        TravelFeedListResponse response = new TravelFeedListResponse();
        response.setCountryId(travel.getCountry().getId());
        response.setCreatorId(travel.getCreatorId());
        if (travel.getStartDate() != null && travel.getEndDate() != null) {
            long days = java.time.temporal.ChronoUnit.DAYS.between(travel.getStartDate(), travel.getEndDate()) + 1;
            response.setDays((int) days);
        } else {
            response.setDays(0);
        }
        response.setId(travel.getId());
        response.setImage(travel.getImage());
        response.setShared(travel.isShared());
        response.setMemberCount(travel.getMemberCount());
        response.setShareStatus(travel.isShareStatus());
        response.setStatus(travel.isStatus());
        response.setTitle(travel.getTitle());
        response.setTotalBudget(travel.getTotalBudget());
        response.setTotalBudgetWon(travel.getTotalBudgetWon());
        response.setCountryName(travel.getCountry().getName());
        return response;
    }

    // 엘라스틱서치 업데이트 메서드
    void updateTravelInElasticsearch(Travel travel) {
        TravelFeedListResponse travelDocument = elasticSearchRepository.findById(travel.getId())
                .orElseThrow(() -> new CustomException(CustomErrorCode.ELASTICSEARCH_DOCUMENT_NOT_FOUND));

        travelDocument.setShared(travel.isShared());
        travelDocument.setStatus(travel.isStatus());

        elasticSearchRepository.save(travelDocument);
    }

}

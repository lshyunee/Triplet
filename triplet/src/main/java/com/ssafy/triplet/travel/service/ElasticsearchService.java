package com.ssafy.triplet.travel.service;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.FieldValue;
import co.elastic.clients.elasticsearch._types.query_dsl.BoolQuery;
import co.elastic.clients.elasticsearch._types.query_dsl.Query;
import co.elastic.clients.elasticsearch._types.query_dsl.RangeQuery;
import co.elastic.clients.elasticsearch.core.DeleteRequest;
import co.elastic.clients.elasticsearch.core.UpdateRequest;
import co.elastic.clients.json.JsonData;
import com.ssafy.triplet.exception.CustomErrorCode;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.travel.dto.request.MemberDocument;
import com.ssafy.triplet.travel.dto.response.TravelFeedListResponse;
import com.ssafy.triplet.travel.dto.response.TravelListPagedResponse;
import com.ssafy.triplet.travel.entity.Travel;
import com.ssafy.triplet.travel.repository.CountryRepository;
import com.ssafy.triplet.travel.repository.TravelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ElasticsearchService {
    private final ElasticsearchOperations elasticsearchOperations;
    private final CountryRepository countryRepository;
    private final TravelRepository travelRepository;

    @Autowired
    private ElasticsearchClient elasticsearchClient;

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

        List<String> userTravelIds = getUserTravelIds(userId);

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
        return userTravels;
    }

    // kind = 0 (추천)
    private void recommendedTravel(BoolQuery.Builder boolQueryBuilder, Long userId) {
        // 모든 여행
        SearchHits<TravelFeedListResponse> allTravels = elasticsearchOperations.search(
                NativeQuery.builder().withQuery(Query.of(q -> q.matchAll(m -> m)))
                        .withPageable(PageRequest.of(0, 100))
                        .build(),
                TravelFeedListResponse.class
        );

        // 모든 여행에 초기점수 0점
        Map<Long, Double> travelScores = allTravels.getSearchHits().stream()
                .collect(Collectors.toMap(
                        hit -> hit.getContent().getId(),
                        hit -> 0.0
                ));

        // 유저 정보 조회
        Query userQuery = Query.of(q -> q.term(t -> t.field("id").value(userId)));
        SearchHits<MemberDocument> userSearchHits = elasticsearchOperations.search(
                NativeQuery.builder().withQuery(userQuery).build(),
                MemberDocument.class
        );

        // 유저 정보 처리
        if (!userSearchHits.getSearchHits().isEmpty()) {
            MemberDocument user = userSearchHits.getSearchHits().get(0).getContent();
            int age = user.getAge();
            int gender = user.getGender();

            // 사용자가 이미 다녀온 travelId 리스트
            List<String> userTravels = user.getTravels() != null ? user.getTravels() : new ArrayList<>();

            // 사용자가 이미 다녀온 travel의 country_id 리스트
            List<String> visitedCountryIds = new ArrayList<>();
            if (!userTravels.isEmpty()) {
                // travel 인덱스에서 사용자가 다녀온 여행지들 country_id 조회
                List<FieldValue> userTravelIds = userTravels.stream()
                        .map(travelId -> FieldValue.of(Long.parseLong(travelId)))
                        .collect(Collectors.toList());

                SearchHits<TravelFeedListResponse> visitedTravels = elasticsearchOperations.search(
                        NativeQuery.builder().withQuery(Query.of(q -> q.terms(t -> t.field("id").terms(terms -> terms.value(userTravelIds))))).build(),
                        TravelFeedListResponse.class
                );
                visitedTravels.getSearchHits().forEach(hit -> visitedCountryIds.add(String.valueOf(hit.getContent().getCountryId())));
            }

            // 사용자 정보로 유사한 사용자 검색
            BoolQuery.Builder similarUserQueryBuilder = new BoolQuery.Builder();
            int ageLowerBound = (age / 10) * 10;
            int ageUpperBound = ageLowerBound + 9;
            similarUserQueryBuilder.must(Query.of(q -> q.range(r -> r.field("age").gte(JsonData.of(ageLowerBound)).lte(JsonData.of(ageUpperBound)))));
            similarUserQueryBuilder.must(Query.of(q -> q.term(t -> t.field("gender").value(gender))));

            SearchHits<MemberDocument> similarUsersSearchHits = elasticsearchOperations.search(
                    NativeQuery.builder().withQuery(Query.of(q -> q.bool(similarUserQueryBuilder.build()))).build(),
                    MemberDocument.class
            );

            // 유사한 사용자들이 다녀온 여행지
            List<FieldValue> similarUserTravelIds = similarUsersSearchHits.getSearchHits().stream()
                    .flatMap(hit -> {
                        List<String> travels = hit.getContent().getTravels();
                        return travels != null ? travels.stream() : Stream.empty();
                    })
                    .map(travelId -> FieldValue.of(Long.parseLong(travelId)))
                    .collect(Collectors.toList());

            // 유사한 사용자의 여행지에 높은 점수
            SearchHits<TravelFeedListResponse> similarTravelHits = elasticsearchOperations.search(
                    NativeQuery.builder().withQuery(Query.of(q -> q.terms(t -> t.field("id").terms(terms -> terms.value(similarUserTravelIds))))).build(),
                    TravelFeedListResponse.class
            );

            similarTravelHits.getSearchHits().forEach(hit -> {
                Long travelId = hit.getContent().getId();
                int travelCountryId = hit.getContent().getCountryId();
                String travelCountryIdStr = String.valueOf(travelCountryId);

                Query memberQuery = Query.of(q -> q.term(t -> t.field("travels").value(travelId)));
                SearchHits<MemberDocument> memberSearchHits = elasticsearchOperations.search(
                        NativeQuery.builder().withQuery(memberQuery).build(),
                        MemberDocument.class
                );

                if (!memberSearchHits.getSearchHits().isEmpty()) {
                    MemberDocument member = memberSearchHits.getSearchHits().get(0).getContent();

                    // 나이 +1
                    if  (member.getAge() >= ageLowerBound && member.getAge() <= ageUpperBound) {
                        travelScores.put(travelId, travelScores.getOrDefault(travelId, 0.0) + 1.0);
                    }

                    // 성별이 같을 경우 +1
                    if (gender == member.getGender()) {
                        travelScores.put(travelId, travelScores.getOrDefault(travelId, 0.0) + 1.0);
                    }
                }

                // 내가 다녀온 country_id가 아닐 경우에만 +1
                if (!visitedCountryIds.contains(travelCountryIdStr)) {
                    travelScores.put(travelId, travelScores.getOrDefault(travelId, 0.0) + 1.0);
                }
            });

            // 사용자가 이미 방문한 여행지는 낮은 점수
            if (!userTravels.isEmpty()) {
                List<Long> userTravelIds = userTravels.stream()
                        .map(Long::parseLong)
                        .collect(Collectors.toList());

                userTravelIds.forEach(travelId -> travelScores.put(travelId, travelScores.getOrDefault(travelId, 0.0) * 0.5));
            }

            // 추천 점수 순으로 정렬
            List<Long> recommendedTravelIds = travelScores.entrySet().stream()
                    .sorted(Map.Entry.<Long, Double>comparingByValue().reversed())
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());

            // 추천된 여행지로 업데이트
            if (!recommendedTravelIds.isEmpty()) {
                List<FieldValue> recommendedFieldValues = recommendedTravelIds.stream()
                        .map(FieldValue::of)
                        .collect(Collectors.toList());

                boolQueryBuilder.must(Query.of(q -> q.terms(t -> t.field("id").terms(terms -> terms.value(recommendedFieldValues)))));
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
            boolQueryBuilder.must(Query.of(q -> q.fuzzy(f -> f.field("country_name").value(countryName).fuzziness("AUTO"))));
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

        // 검색 요청 생성
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

    // 여행 공유시 엘라스틱서치 업데이트 메서드
    void updateTravelInElasticsearch(Travel travel) throws IOException {
        Map<String, Object> updates = new HashMap<>();
        updates.put("is_shared", travel.isShared());
        updates.put("status", travel.isStatus());
        UpdateRequest updateRequest = new UpdateRequest.Builder()
                .index("travel")
                .id(travel.getId().toString())
                .doc(updates)
                .build();
        elasticsearchClient.update(updateRequest, TravelFeedListResponse.class);
    }

    // 여행 삭제시 엘라스틱서치에서도 삭제
    void removeTravelInElasticsearch(Long travelId) throws IOException {
        DeleteRequest deleteRequest = new DeleteRequest.Builder()
                .index("travel")
                .id(travelId.toString())
                .build();

        elasticsearchClient.delete(deleteRequest);
    }
}

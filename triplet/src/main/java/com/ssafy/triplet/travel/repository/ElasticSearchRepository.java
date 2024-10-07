package com.ssafy.triplet.travel.repository;

import com.ssafy.triplet.travel.dto.response.TravelFeedListResponse;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ElasticSearchRepository extends ElasticsearchRepository<TravelFeedListResponse, Long> {
    // 엘라스틱서치에 관련된 쿼리 메서드 추가 가능
}

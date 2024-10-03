package com.ssafy.triplet.config;

import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestClientBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ElasticsearchConfig {

    @Bean
    public RestHighLevelClient client() {
        RestClientBuilder builder = RestClient.builder(/* Elasticsearch 서버의 주소와 포트 */);
        return new RestHighLevelClient(builder);
    }
}

//package com.ssafy.triplet.config;
//
//import com.fasterxml.jackson.databind.DeserializationFeature;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.databind.SerializationFeature;
//import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
//import com.fasterxml.jackson.databind.jsontype.PolymorphicTypeValidator;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//import com.ssafy.triplet.exchange.entity.ExchangeRates;
//import lombok.RequiredArgsConstructor;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.data.redis.connection.RedisConnectionFactory;
//import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
//import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
//import org.springframework.data.redis.serializer.StringRedisSerializer;
//
//@Configuration
//@RequiredArgsConstructor
//public class RedisConfig {
//
//    @Value("${spring.data.redis.host}")
//    private String host;
//
//    @Value("${spring.data.redis.port}")
//    private int port;
//
//    @Value("${spring.data.redis.password}")
//    private String password;
//
//    @Bean
//    public RedisConnectionFactory redisConnectionFactory(){
//        // LettuceConnectionFactory를 사용하여 Redis 연결 팩토리 생성, 호스트와 포트 정보를 사용
//        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
//        redisStandaloneConfiguration.setHostName(host);
//        redisStandaloneConfiguration.setPort(port);
//        redisStandaloneConfiguration.setPassword(password);
//        LettuceConnectionFactory factory = new LettuceConnectionFactory(redisStandaloneConfiguration);
//        return factory;
//    }
//
//    @Bean
//    public RedisTemplate<String, ExchangeRates> redisTemplate() {
//        RedisTemplate<String, ExchangeRates> redisTemplate = new RedisTemplate<>(); // RedisTemplate 인스턴스 생성
//        redisTemplate.setConnectionFactory(redisConnectionFactory()); // Redis 연결 팩토리 설정
//        redisTemplate.setKeySerializer(new StringRedisSerializer()); // 키를 문자열로 직렬화하도록 설정
//
//        // Value 직렬화 설정
//        // 문자열이아닌 ExchangeRate라는 Entity로 직렬화 해야하기 때문에 아래와 같은 설정이 필요하다.
//        //  ExchangeRate 클래스 타입으로 직렬화,역직렬화가 가능하도록 허용해주는 설정
//        PolymorphicTypeValidator typeValidator = BasicPolymorphicTypeValidator
//                .builder()
//                .allowIfSubType(ExchangeRates.class)
//                .build();
//
//        // ObjectMapper 를 톻해  매핑
//        // configure => 알 수 없는 속성이 들어오는 경우 직렬화 하지 않도록 설정
//        // registerModule => 시간 데이터가 있는 경우 java.time 으로 직렬화하도록 설정
//        // activateDefaultTyping =>  ExchangeRates 역직렬화 유효성 검사 및 int, String, boolea, double 제외
//        // 모든 데이터 유형이 기본 유형이 되도록 지정
//        // disable => 날짜형 데이터 timestamp로 직렬화 되도록 설정
//        ObjectMapper objectMapper = new ObjectMapper()
//                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,false)
//                .registerModule(new JavaTimeModule())
//                .activateDefaultTyping(typeValidator,ObjectMapper.DefaultTyping.NON_FINAL)
//                .disable(SerializationFeature.WRITE_DATE_KEYS_AS_TIMESTAMPS);
//
//        GenericJackson2JsonRedisSerializer customSerializer = new GenericJackson2JsonRedisSerializer(objectMapper);
//        redisTemplate.setValueSerializer(customSerializer);
//
//        return redisTemplate;
//    }
//}
package com.ssafy.triplet.config;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.jsontype.BasicPolymorphicTypeValidator;
import com.fasterxml.jackson.databind.jsontype.PolymorphicTypeValidator;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.ssafy.triplet.exchange.entity.ExchangeRates;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
@RequiredArgsConstructor
public class RedisConfig {

    @Value("${spring.data.redis.host}")
    private String host;

    @Value("${spring.data.redis.port}")
    private int port;

    @Value("${spring.data.redis.password}")
    private String password;

    @Bean
    public RedisConnectionFactory redisConnectionFactory(){
        // LettuceConnectionFactory를 사용하여 Redis 연결 팩토리 생성, 호스트와 포트 정보를 사용
        RedisStandaloneConfiguration redisStandaloneConfiguration = new RedisStandaloneConfiguration();
        redisStandaloneConfiguration.setHostName(host);
        redisStandaloneConfiguration.setPort(port);
        redisStandaloneConfiguration.setPassword(password);
        LettuceConnectionFactory factory = new LettuceConnectionFactory(redisStandaloneConfiguration);
        return factory;
    }

    @Bean
    public RedisTemplate<String, ExchangeRates> redisTemplate() {
        RedisTemplate<String, ExchangeRates> redisTemplate = new RedisTemplate<>(); // RedisTemplate 인스턴스 생성
        redisTemplate.setConnectionFactory(redisConnectionFactory()); // Redis 연결 팩토리 설정
        redisTemplate.setKeySerializer(new StringRedisSerializer()); // 키를 문자열로 직렬화하도록 설정

        // Value 직렬화 설정
        // 문자열이아닌 ExchangeRate라는 Entity로 직렬화 해야하기 때문에 아래와 같은 설정이 필요하다.
        //  ExchangeRate 클래스 타입으로 직렬화,역직렬화가 가능하도록 허용해주는 설정
        PolymorphicTypeValidator typeValidator = BasicPolymorphicTypeValidator
                .builder()
                .allowIfSubType(ExchangeRates.class)
                .build();

        // ObjectMapper 를 톻해  매핑
        // configure => 알 수 없는 속성이 들어오는 경우 직렬화 하지 않도록 설정
        // registerModule => 시간 데이터가 있는 경우 java.time 으로 직렬화하도록 설정
        // activateDefaultTyping =>  ExchangeRates 역직렬화 유효성 검사 및 int, String, boolea, double 제외
        // 모든 데이터 유형이 기본 유형이 되도록 지정
        // disable => 날짜형 데이터 timestamp로 직렬화 되도록 설정
        ObjectMapper objectMapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,false)
                .registerModule(new JavaTimeModule())
                .activateDefaultTyping(typeValidator,ObjectMapper.DefaultTyping.NON_FINAL)
                .disable(SerializationFeature.WRITE_DATE_KEYS_AS_TIMESTAMPS);

        GenericJackson2JsonRedisSerializer customSerializer = new GenericJackson2JsonRedisSerializer(objectMapper);
        redisTemplate.setValueSerializer(customSerializer);
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        redisTemplate.setHashValueSerializer(customSerializer);

        return redisTemplate;
    }
}
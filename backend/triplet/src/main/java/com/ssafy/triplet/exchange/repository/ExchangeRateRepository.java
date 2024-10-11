package com.ssafy.triplet.exchange.repository;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.triplet.exchange.dto.request.Header;
import com.ssafy.triplet.exchange.entity.ExchangeRates;
import com.ssafy.triplet.exchange.util.EntityParser;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.RedisScript;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Slf4j
@Repository
public class ExchangeRateRepository {


    @Value("${ssafy.api.key}")
    private String apiKey;

    @Value("${ssafy.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    private final StringRedisTemplate stringRedisTemplate;

    private final RedisScript<String> redisScript;

    private final EntityParser entityParser = new EntityParser();

    private final Header header = new Header();

    private final ObjectMapper objectMapper;

    // Redis Template
    private final RedisTemplate<String, ExchangeRates> redisTemplate;
    // Redis의 Hash 자료형 처리하기 위해 사용
    private final HashOperations<String, String, ExchangeRates> hashOperations;

    private final List<String> currencies = List.of("GBP", "CAD", "CNY", "EUR", "CHF", "USD", "JPY");


    // 환율 키 설정
    private String current = "currentExchangeRates";
    private String previous = "previousExchangeRates";

    public ExchangeRateRepository(StringRedisTemplate stringRedisTemplate,
                                  RedisTemplate<String, ExchangeRates> redisTemplate,
                                  RedisScript<String> redisScript,
                                  ObjectMapper objectMapper

                                    ) {
        this.stringRedisTemplate = stringRedisTemplate;
        this.redisTemplate = redisTemplate;
        this.redisScript = redisScript;
        this.objectMapper = objectMapper;
        this.hashOperations =  redisTemplate.opsForHash();
    }
//    private final ObjectMapper objectMapper = new ObjectMapper();
//            .activateDefaultTyping(
//            BasicPolymorphicTypeValidator.builder().allowIfBaseType(ExchangeRates.class).build(),
//            ObjectMapper.DefaultTyping.NON_FINAL,
//            JsonTypeInfo.As.PROPERTY
//    );


//    @Scheduled(fixedRate = 600000)
//    public void renewalExchangeRate() {
//        String current = "currentExchangeRates";
//        String previous = "previousExchangeRates";
//
//
//        log.info("-------환율 갱신 시작-----------");
//        List<ExchangeRates> exchangeRates = fetchExchangeRates();
//        try {
//            if (!exchangeRates.isEmpty()) {
//
//                // redis 에 저장된 이전 환율 삭제
//                if (redisTemplate.hasKey(previous)) {
//                    redisTemplate.delete(previous);
//                }
//                if (redisTemplate.hasKey(current)) {
//                    // redis의 현재환율을 이전 환율로 저장
//                    redisTemplate.rename(current, previous);
//
//                    // redis의 현재 환율 key 삭제
//                    redisTemplate.delete(current);
//                }
//
//                // 현재 환율 redis에 저장
//                for (ExchangeRates exchangeRate : exchangeRates) {
//                    redisTemplate.opsForList().rightPush(current, exchangeRate);
//                }
//            }
//
//        } catch (Exception e) {
//            log.info("Redis 환율 갱신 실패");
//        }
//
//        log.info("-------환율 갱신 성공-----------");
//
//    }

    // 외부 API 에서 환율 불러오는 메서드
    public Map<String, ExchangeRates> fetchExchangeRates() {

        // 환율 정보를 담을 리스트 생성
        Map<String, ExchangeRates>  exchangeRates = null;


        // headers에 context-type을 JSON 형식으로 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // JSON 형식으로 body를 보내기 위해 JSON Object 생성
        JSONObject body = new JSONObject();

        // 현재 날짜와 시간 구하기
        String nowDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        String nowTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));

        // Body에 보낼 Entity에 값 넣어주기
        header.setApiKey(apiKey);
        header.setTransmissionDate(nowDate);
        header.setTransmissionTime(nowTime);
        header.setApiName("exchangeRate");
        header.setApiServiceCode("exchangeRate");

        Random random = new Random();
        int randomNumber = 100000 + random.nextInt(900000);
        header.setInstitutionTransactionUniqueNo(nowDate + nowTime + randomNumber);

        // JSON 형식으로 Entity를 넣어줌
        body.put("Header", header);

        // HttpEntity로 요청 body와 header 설정
        HttpEntity<JSONObject> req = new HttpEntity<>(body, headers);

        // restTemplate로 지정된 url로 post 요청 -> 결과값을 responseEntity에 문자열로 저장
        try {

            ResponseEntity<String> res = restTemplate.postForEntity(apiUrl, req, String.class);

            if (res.getStatusCode().is2xxSuccessful()) {
                exchangeRates = entityParser.getExchangeRateMap(res.getBody().toString());
            }
        } catch (Exception e) {
            log.info("환율 정보를 불러오는데 실패했습니다.");
        }


        return exchangeRates;
    }

    // 매일 11 시 마다 Redis에 저장된 환율 갱신하는 매서드
    @Scheduled(cron = "0 0 11 * * *")
    public void updateExchangeRatesWithLua() {
        // 외부 API를 통해 최신 환율 받아오기
        Map<String, ExchangeRates>  newExchangeRatesMap = fetchExchangeRates();
        // 최신 환율 받아오면
        if (newExchangeRatesMap != null) {
            // Lua Script 에 맞는 데이터로 변환하기 위한 List 생성
            List<String> luaData = new ArrayList<>();
            try {
                // Redis에서 이전, 환율을 불러옴
                Map<String, ExchangeRates> currentExchangeRatesMap = findAll("currentExchangeRates");
                // 환율 코드로 환율 정보를 불러온 후
                // 환율 비교 -> 변화율 계산 -> response에 담아서 리턴
                for (String currency : currencies) {

                    ExchangeRates currentExchangeRates = currentExchangeRatesMap.get(currency);
                    ExchangeRates newExchangeRates = newExchangeRatesMap.get(currency);

                    Double currentExchangeRate = Double.valueOf(currentExchangeRates.getExchangeRate().replace(",", ""));
                    Double newExchangeRate = Double.valueOf(newExchangeRates.getExchangeRate().replace(",", ""));

                    Double changePercentage = ((newExchangeRate - currentExchangeRate) / currentExchangeRate) * 100;


                    newExchangeRates.setChangePercentage(String.format("%.2f", Math.abs(changePercentage)));
                    newExchangeRates.setChangeStatus((int) Math.signum(changePercentage));




                    // 환율 데이터를 Redis 에 JSON 형식으로 저장하기 위해 매핑
                    // 역직렬화 할때 ExchangeRates 로 하기위해 클래스를 같이 저장
                    String className = newExchangeRates.getClass().getName();
                    newExchangeRates.setExchangeRate(String.valueOf(newExchangeRate));
                    if(newExchangeRates.getCurrency().equals("JPY")){
                        newExchangeRates.setExchangeMin(100);
                    }else if(newExchangeRates.getCurrency().equals("CNY")){
                        newExchangeRates.setExchangeMin(5);
                    }else{
                        newExchangeRates.setExchangeMin(1);
                    }
                    Object[] arrayFormat = {className, newExchangeRates};
                    //  objectMapper 를통해 Json 으로 변환
                    String json = objectMapper.writeValueAsString(arrayFormat);
                    // luaData에 추가
                    luaData.add(newExchangeRates.getCurrency());
                    luaData.add(json);
                }
            } catch (JsonProcessingException e) {
                log.info("JSON 변환 실패");
            }
            // redisTemplate 의 execute를 이용해 luaScript 실행
            // Array로 하면 args.. 으로 넘길 수 있다.
            stringRedisTemplate.execute(redisScript, List.of(current, previous), luaData.toArray());

        }
        log.info("스케줄러 실행 완료");
    }

    // 환율 단건 조회

    public ExchangeRates findExchangeRateByCurrency(String currency) {

        ExchangeRates result = null;
        try {
            // Redis Hash 에서 통화코드로 조회
            result = hashOperations.get(current, currency);
        } catch (Exception e) {
            log.info("getExchangeRate() : 환율 단건 조회 실패");
        }
        return result;
    }

    // 환율 전체 조회
    public Map<String, ExchangeRates> findAll(String key){

        // Redis에서 이전, 현재 환률을 불러옴
        Map<String, ExchangeRates> ExchangeRatesMap = hashOperations.entries(key);

        return ExchangeRatesMap;
    }

    // 지원하는 통화 조회
    public List<String> getCurrencies() {
        return currencies;
    }

}






// ------------------ v2인데 여기서 이전날 오늘날 환율 비교 하기 위해서 List 말고 Hash로 저장해야함 ---------------------
//package com.ssafy.triplet.exchange.repository;
//
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.ssafy.triplet.exchange.dto.request.Header;
//import com.ssafy.triplet.exchange.entity.ExchangeRates;
//import com.ssafy.triplet.exchange.util.EntityParser;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import net.minidev.json.JSONObject;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.data.redis.core.StringRedisTemplate;
//import org.springframework.data.redis.core.script.RedisScript;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Repository;
//import org.springframework.web.client.RestTemplate;
//
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.time.format.DateTimeFormatter;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.Random;
//
//@RequiredArgsConstructor
//@Slf4j
//@Repository
//public class ExchangeRateRepository {
//
//
//    @Value("${ssafy.api.key}")
//    private String apiKey;
//
//    @Value("${ssafy.api.url}")
//    private String apiUrl;
//
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    private final StringRedisTemplate redisTemplate;
//
//    private final RedisScript<String> redisScript;
//
//    private EntityParser entityParser = new EntityParser();
//
//    private Header header = new Header();
//
//    private ObjectMapper objectMapper = new ObjectMapper();
////            .activateDefaultTyping(
////            BasicPolymorphicTypeValidator.builder().allowIfBaseType(ExchangeRates.class).build(),
////            ObjectMapper.DefaultTyping.NON_FINAL,
////            JsonTypeInfo.As.PROPERTY
////    );
//
//
////    @Scheduled(fixedRate = 600000)
////    public void renewalExchangeRate() {
////        String current = "currentExchangeRates";
////        String previous = "previousExchangeRates";
////
////
////        log.info("-------환율 갱신 시작-----------");
////        List<ExchangeRates> exchangeRates = fetchExchangeRates();
////        try {
////            if (!exchangeRates.isEmpty()) {
////
////                // redis 에 저장된 이전 환율 삭제
////                if (redisTemplate.hasKey(previous)) {
////                    redisTemplate.delete(previous);
////                }
////                if (redisTemplate.hasKey(current)) {
////                    // redis의 현재환율을 이전 환율로 저장
////                    redisTemplate.rename(current, previous);
////
////                    // redis의 현재 환율 key 삭제
////                    redisTemplate.delete(current);
////                }
////
////                // 현재 환율 redis에 저장
////                for (ExchangeRates exchangeRate : exchangeRates) {
////                    redisTemplate.opsForList().rightPush(current, exchangeRate);
////                }
////            }
////
////        } catch (Exception e) {
////            log.info("Redis 환율 갱신 실패");
////        }
////
////        log.info("-------환율 갱신 성공-----------");
////
////    }
//
//    public List<ExchangeRates> fetchExchangeRates() {
//
//        // 환율 정보를 담을 리스트 생성
//        List<ExchangeRates> exchangeRates = null;
//
//
//        // headers에 context-type을 JSON 형식으로 설정
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        // JSON 형식으로 body를 보내기 위해 JSON Object 생성
//        JSONObject body = new JSONObject();
//
//        // 현재 날짜와 시간 구하기
//        String nowDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
//        String nowTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));
//
//        // Body에 보낼 Entity에 값 넣어주기
//        header.setApiKey(apiKey);
//        header.setTransmissionDate(nowDate);
//        header.setTransmissionTime(nowTime);
//        header.setApiName("exchangeRate");
//        header.setApiServiceCode("exchangeRate");
//
//        Random random = new Random();
//        int randomNumber = 100000 + random.nextInt(900000);
//        header.setInstitutionTransactionUniqueNo(nowDate + nowTime + randomNumber);
//
//        // JSON 형식으로 Entity를 넣어줌
//        body.put("Header", header);
//
//        // HttpEntity로 요청 body와 header 설정
//        HttpEntity<JSONObject> req = new HttpEntity<>(body, headers);
//
//        // restTemplate로 지정된 url로 post 요청 -> 결과값을 responseEntity에 문자열로 저장
//        try {
//
//            ResponseEntity<String> res = restTemplate.postForEntity(apiUrl, req, String.class);
//
//            if (res.getStatusCode().is2xxSuccessful()) {
//                exchangeRates = entityParser.toEntity(res.getBody().toString());
//            }
//        } catch (Exception e) {
//            log.info("환율 정보를 불러오는데 실패했습니다.");
//        }
//
//
//        return exchangeRates;
//    }
//
//    @Scheduled(cron = "0 0 11 * * *")
//    public void updateExchangeRatesWithLua() {
//
//        List<ExchangeRates> newExchangeRates = fetchExchangeRates();
//        if (newExchangeRates != null) {
//            List<String> luaData = new ArrayList<>();
//            try {
//                for (ExchangeRates exchangeRate : newExchangeRates) {
//                    String className = exchangeRate.getClass().getName();
//                    Object[] arrayFormat = {className, exchangeRate};
//                    String json = objectMapper.writeValueAsString(arrayFormat);
//                    luaData.add(json);
//                }
//            } catch (JsonProcessingException e) {
//                log.info("JSON 변환 실패");
//            }
//            // RedisCallback을 사용하여 Lua 스크립트를 Redis 서버에서 실행
//            redisTemplate.execute(redisScript, List.of("currentExchangeRates", "previousExchangeRates"), luaData.toArray());
//
//        }
//        log.info("스케줄러 실행 완료");
//    }
//}
//
//


//package com.ssafy.triplet.exchange.repository;
//
//import com.ssafy.triplet.exchange.dto.request.Header;
//import com.ssafy.triplet.exchange.entity.ExchangeRates;
//import com.ssafy.triplet.exchange.util.EntityParser;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import net.minidev.json.JSONObject;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.data.redis.core.RedisTemplate;
//import org.springframework.data.redis.core.script.RedisScript;
//import org.springframework.http.HttpEntity;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Repository;
//import org.springframework.web.client.RestTemplate;
//
//import java.time.LocalDate;
//import java.time.LocalTime;
//import java.time.format.DateTimeFormatter;
//import java.util.List;
//import java.util.Random;
//
//@RequiredArgsConstructor
//@Slf4j
//@Repository
//public class ExchangeRateRepository {
//
//
//    @Value("${ssafy.api.key}")
//    private String apiKey;
//
//    @Value("${ssafy.api.url}")
//    private String apiUrl;
//
//    private final RestTemplate restTemplate = new RestTemplate();
//
//    private final RedisTemplate<String, ExchangeRates> redisTemplate;
//
//    private final RedisScript<String> redisScript;
//
//    private EntityParser entityParser = new EntityParser();
//
//    private Header header = new Header();
//
//
//
//
//    @Scheduled(fixedRate = 600000)
//    public void renewalExchangeRate() {
//        String current = "currentExchangeRates";
//        String previous = "previousExchangeRates";
//
//
//        log.info("-------환율 갱신 시작-----------");
//        List<ExchangeRates> exchangeRates = fetchExchangeRates();
//        try {
//            if (!exchangeRates.isEmpty()) {
//
//                // redis 에 저장된 이전 환율 삭제
//                if (redisTemplate.hasKey(previous)) {
//                    redisTemplate.delete(previous);
//                }
//                if (redisTemplate.hasKey(current)) {
//                    // redis의 현재환율을 이전 환율로 저장
//                    redisTemplate.rename(current, previous);
//
//                    // redis의 현재 환율 key 삭제
//                    redisTemplate.delete(current);
//                }
//
//                // 현재 환율 redis에 저장
//                for (ExchangeRates exchangeRate : exchangeRates) {
//                    redisTemplate.opsForList().rightPush(current, exchangeRate);
//                }
//            }
//
//        } catch (Exception e) {
//            log.info("Redis 환율 갱신 실패");
//        }
//
//        log.info("-------환율 갱신 성공-----------");
//
//    }
//
//    public List<ExchangeRates> fetchExchangeRates() {
//
//        // 환율 정보를 담을 리스트 생성
//        List<ExchangeRates> exchangeRates = null;
//
//
//        // headers에 context-type을 JSON 형식으로 설정
//        HttpHeaders headers = new HttpHeaders();
//        headers.setContentType(MediaType.APPLICATION_JSON);
//
//        // JSON 형식으로 body를 보내기 위해 JSON Object 생성
//        JSONObject body = new JSONObject();
//
//        // 현재 날짜와 시간 구하기
//        String nowDate = LocalDate.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
//        String nowTime = LocalTime.now().format(DateTimeFormatter.ofPattern("HHmmss"));
//
//        // Body에 보낼 Entity에 값 넣어주기
//        header.setApiKey(apiKey);
//        header.setTransmissionDate(nowDate);
//        header.setTransmissionTime(nowTime);
//        header.setApiName("exchangeRate");
//        header.setApiServiceCode("exchangeRate");
//
//        Random random = new Random();
//        int randomNumber = 100000 + random.nextInt(900000);
//        header.setInstitutionTransactionUniqueNo(nowDate + nowTime + randomNumber);
//
//        // JSON 형식으로 Entity를 넣어줌
//        body.put("Header", header);
//
//        // HttpEntity로 요청 body와 header 설정
//        HttpEntity<JSONObject> req = new HttpEntity<>(body, headers);
//
//        // restTemplate로 지정된 url로 post 요청 -> 결과값을 responseEntity에 문자열로 저장
//        try {
//
//            ResponseEntity<String> res = restTemplate.postForEntity(apiUrl, req, String.class);
//
//            if (res.getStatusCode().is2xxSuccessful()) {
//                exchangeRates = entityParser.toEntity(res.getBody().toString());
//            }
//        } catch (Exception e) {
//            log.info("환율 정보를 불러오는데 실패했습니다.");
//        }
//
//
//        return exchangeRates;
//    }
//
////    @Scheduled(fixedRate = 60000)
////    public void updateExchangeRatesWithLua() {
////
////        List<ExchangeRates> newExchangeRates = fetchExchangeRates();
////        if(!newExchangeRates.isEmpty()) {
////            List<String> luaData = newExchangeRates.stream().map(O)
////        }
////
////        // RedisCallback을 사용하여 Lua 스크립트를 Redis 서버에서 실행
////        redisTemplate.execute(redisScript,List.of("current","previous"),newExchangeRates);
////
////        log.info("Exchange rates updated with Lua script.");
////    }
//}
// ---------------------------------------------------------------------------------
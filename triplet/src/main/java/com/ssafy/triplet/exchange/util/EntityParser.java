package com.ssafy.triplet.exchange.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.triplet.exchange.entity.ExchangeRates;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.List;

@Slf4j
public class EntityParser {

    private ObjectMapper objectMapper = new ObjectMapper();

    public List<ExchangeRates> toEntity(String res)  {

        List<ExchangeRates> result = null;
        try {

            result = objectMapper.readValue(
                            objectMapper
                                    .readTree(res)
                                    .get("REC")
                                    .toString()
                    ,new TypeReference<List<ExchangeRates>>(){});



        }catch (IOException e){
           log.info("JSON -> ExchangeRates Entity Deserialize 에러");
        }
        return result;
    }

}

package com.ssafy.triplet.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.data.redis.core.script.RedisScript;

@Configuration
public class ScriptConfig {

    @Bean
    public RedisScript<String> script() {
        Resource scriptSource = new ClassPathResource("scripts/refreshExchangeRates.lua");
        return RedisScript.of(scriptSource, String.class);
    }

}
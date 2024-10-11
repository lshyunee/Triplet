package com.ssafy.triplet.auth.dto;


import java.util.Map;

public class KakaoUserDetails implements OAuth2Response {

    private final Map<String, Object> attributes;

    public KakaoUserDetails(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getProvider() {
        return "kakao";
    }

    @Override
    public String getProviderId() {
        return attributes.get("id").toString();
    }

}

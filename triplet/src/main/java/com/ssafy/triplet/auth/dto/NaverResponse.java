package com.ssafy.triplet.auth.dto;


import java.util.Map;

public class NaverResponse implements OAuth2Response {

    private final Map<String, Object> attribute;

    public NaverResponse(Map<String, Object> attribute) {
        this.attribute = (Map<String, Object>) attribute.get("response");
    }

    @Override
    public String getProvider() {
        return "naver";
    }

    @Override
    public String getProviderId() {
        return attribute.get("id").toString();
    }

    @Override
    public String getName() {
        return attribute.get("name").toString();
    }

    public String getGender() {
        return attribute.get("gender").toString();
    }

    public String getBirthday() {
        return attribute.get("birthday").toString();
    }

    public String getBirthyear() {
        return attribute.get("birthyear").toString();
    }

    public String getMobile() {
        return attribute.get("mobile").toString();
    }

}

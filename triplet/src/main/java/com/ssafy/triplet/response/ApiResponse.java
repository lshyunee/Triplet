package com.ssafy.triplet.response;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<T> {

    private String code;

    private String message;

    private T data;

    public ApiResponse(String code, String message) {
        this.code = code;
        this.message = message;
    }

}

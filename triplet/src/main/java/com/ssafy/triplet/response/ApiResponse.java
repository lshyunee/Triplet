package com.ssafy.triplet.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
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

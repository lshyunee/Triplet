package com.ssafy.triplet.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CustomErrorCode {

    // 회원가입
    ID_ALREADY_REGISTERED("M0001", "이미 등록된 ID입니다."),
    INVALID_ID("M0002", "유효하지 않은 아이디입니다."),
    INVALID_PASSWORD("M0005", "유효하지 않은 비밀번호입니다."),
    PASSWORD_MISMATCH("M0006", "입력한 두 비밀번호가 일치하지 않습니다."),
    INVALID_IDENTIFICATION_NUMBER("M0008", "주민등록번호가 유효하지 않습니다."),
    INVALID_PHONE_NUMBER("M0014", "휴대폰 번호가 유효하지 않습니다."),
    INVALID_SIMPLE_PASSWORD("M0003", "유효하지 않은 간편 비밀번호입니다."),
    EMPTY_NAME("M0017", "이름은 비어있을 수 없습니다."),
    SIMPLE_PASSWORD_MISMATCH("M0004", "간편비밀번호가 일치하지 않습니다.");

    private final String code;
    private final String message;

}

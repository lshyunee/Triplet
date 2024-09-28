package com.ssafy.triplet.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CustomErrorCode {

    ID_ALREADY_REGISTERED("M0001", "이미 등록된 아이디입니다.", HttpStatus.BAD_REQUEST),
    PASSWORD_MISMATCH("M0006", "입력한 두 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    INCORRECT_PASSWORD("M0013", "현재 비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    SIMPLE_PASSWORD_MISMATCH("M0004", "간편비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_BALANCE("A0006", "계좌 잔액이 부족하여 거래가 실패했습니다.", HttpStatus.BAD_REQUEST),
    KRW_ACCOUNT_ONLY("C0002", "원화 계좌만 가능합니다.", HttpStatus.BAD_REQUEST),
    INVALID_START_DATE("A0014", "조회 시작일자가 유효하지 않습니다.", HttpStatus.BAD_REQUEST),
    INVALID_END_DATE("A0015", "조회 종료일자가 유효하지 않습니다.", HttpStatus.BAD_REQUEST),
    DATE_EXCEEDS_TODAY("A0028", "오늘 이후의 날짜는 선택할 수 없습니다.", HttpStatus.BAD_REQUEST),
    MEMBER_NOT_FOUND("M0010", "존재하지 않는 회원입니다.", HttpStatus.NOT_FOUND),
    WITHDRAWAL_ACCOUNT_NOT_FOUND("A0024", "출금 계좌가 존재하지 않습니다.", HttpStatus.NOT_FOUND),
    DEPOSIT_ACCOUNT_NOT_FOUND("A0007", "입금계좌가 존재하지 않습니다.", HttpStatus.NOT_FOUND),
    ACCOUNT_NOT_FOUND("A0023", "계좌가 존재하지 않습니다.", HttpStatus.NOT_FOUND),
    STRING_TO_JSON_FAIL("E0000","서버에서 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_CURRENCY_CODE("C0001","통화 코드가 유효하지 않습니다.",HttpStatus.BAD_REQUEST);

    private final String code;
    private final String message;
    private final HttpStatus status;

}

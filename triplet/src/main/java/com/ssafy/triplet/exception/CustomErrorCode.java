package com.ssafy.triplet.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum CustomErrorCode {

    ID_ALREADY_REGISTERED("M0001", "이미 등록된 아이디입니다.", HttpStatus.BAD_REQUEST),
    PHONENUMBER_ALREADY_REGISTERED("M0019", "이미 등록된 전화번호 입니다.", HttpStatus.BAD_REQUEST),
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
    INVALID_CURRENCY_CODE("C0001","통화 코드가 유효하지 않습니다.",HttpStatus.BAD_REQUEST),
    TRAVEL_NOT_FOUND("T0004", "여행이 존재하지 않습니다.", HttpStatus.NOT_FOUND),
    NOT_TRAVEL_CREATOR("T0011", "여행 생성자가 아닙니다.", HttpStatus.FORBIDDEN),
    TRAVEL_NOT_COMPLETED("T0012", "여행이 종료되지 않았습니다.", HttpStatus.BAD_REQUEST),
    COUNTRY_NOT_FOUND("T0006", "국가를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    CATEGORY_NOT_FOUND("T0008", "카테고리를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    INVALID_INVITE_CODE("T0001", "초대코드가 유효하지 않습니다.", HttpStatus.BAD_REQUEST),
    REQUIRED_VALUE_MISSING("T0002", "필수 입력 값이 비어있습니다.", HttpStatus.BAD_REQUEST),
    INVALID_TRAVEL_START_DATE("T0003", "시작일은 현재 날짜보다 이후여야 합니다.", HttpStatus.BAD_REQUEST),
    TRAVEL_SCHEDULE_CONFLICT("T0010", "여행 일정이 기존 여행과 겹칩니다.", HttpStatus.CONFLICT),
    INVALID_TRAVEL_END_DATE("T0009", "종료일은 시작일보다 이후여야 합니다.", HttpStatus.BAD_REQUEST),
    INVALID_STATUS_VALUE("T0007", "0이나 1의 상태만 보낼 수 있습니다.", HttpStatus.BAD_REQUEST),
    USER_ALREADY_IN_TRAVEL("T0015", "해당 유저는 이미 이 여행에 속해 있습니다.", HttpStatus.CONFLICT),
    TRAVEL_MEMBER_LIMIT_EXCEEDED("T0017", "여행 인원이 초과되었습니다.", HttpStatus.BAD_REQUEST),
    USER_NOT_IN_TRAVEL("T0016", "해당 유저는 이미 이 여행에 속해 있지 않습니다.", HttpStatus.BAD_REQUEST),
    TRAVEL_WALLET_HAS_BALANCE("T0018", "여행 지갑에 잔액이 있습니다.", HttpStatus.BAD_REQUEST),
    SAME_CURRENCY_NOT_ALLOWED_ERROR("C0005","동일한 통화로 환전이 불가능합니다.", HttpStatus.BAD_REQUEST),
    CURRENCY_MISMATCH_ERROR("C0002","외화 → 원화 , 원화 → 외화만 가능합니다.",HttpStatus.BAD_REQUEST),
    MAX_UPLOAD_SIZE_EXCEEDED("E0003", "업로드 가능한 파일 크기를 초과했습니다.", HttpStatus.PAYLOAD_TOO_LARGE),
    ELASTICSEARCH_ERROR("E0004", "Elasticsearch 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    MERCHANT_NOT_FOUND("A0019","가맹점이 존재하지 않습니다.",HttpStatus.NOT_FOUND),
    MERCHANT_AND_PAYMENT_CURRENCY_MISMATCH("A0029","가맹점과 동일한 통화의 계좌만 결제 가능합니다.",HttpStatus.BAD_REQUEST),
    INVALID_PRICE_VALUE("A0030","결제 금액을 확인하세요",HttpStatus.BAD_REQUEST),
    TRAVEL_BUDGET_NOT_FOUND("T0020", "카테고리 여행 예산을 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    ACCOUNT_PERMISSION_DENIED("A0031","계좌에 접근할 권한이 없습니다.",HttpStatus.FORBIDDEN),
    TOKEN_SAVE_FAIL("E0005","Device Token 저장에 실패했습니다.",HttpStatus.BAD_REQUEST),
    DEVICE_TOKEN_NOT_FOUND("E0006","Device Token을 찾을 수 없습니다.",HttpStatus.NOT_FOUND),
    INVALID_KIND_ERROR("T0021", "유효하지 않은 kind 값입니다.", HttpStatus.BAD_REQUEST);
    private final String code;
    private final String message;
    private final HttpStatus status;

}

package com.ssafy.triplet.account.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;


@Getter
public class TransactionListRequest {

    @NotNull(message = "계좌 아이디가 유효하지 않습니다.")
    private Long accountId;
    @NotNull(message = "조회 시작일자가 유효하지 않습니다.")
    private String startDate;
    @NotNull(message = "조회 종료일자가 유효하지 않습니다.")
    private String endDate;

}

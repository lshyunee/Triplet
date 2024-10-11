package com.ssafy.triplet.exchange.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Header {

    private String apiName;
    private String transmissionDate;
    private String transmissionTime;
    private String institutionCode = "00100";
    private String fintechAppNo = "001";
    private String apiServiceCode;
    private String institutionTransactionUniqueNo;
    private String apiKey;

}

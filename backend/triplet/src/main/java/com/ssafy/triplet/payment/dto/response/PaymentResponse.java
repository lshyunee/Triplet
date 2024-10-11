package com.ssafy.triplet.payment.dto.response;


import lombok.*;

@Getter
@Setter
@Builder
public class PaymentResponse {

    Long merchantId;

    String merchantName;

    Double price;

    String currency;

}

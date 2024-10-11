package com.ssafy.triplet.payment.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PaymentRequest {


    Long merchantId;

    Double price;

    Boolean isTravel;

    Long accountId;

}

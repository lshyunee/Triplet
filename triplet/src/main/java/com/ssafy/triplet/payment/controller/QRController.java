package com.ssafy.triplet.payment.controller;

import com.google.zxing.WriterException;
import com.ssafy.triplet.payment.service.QRService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class QRController {

    private final QRService qrService;

    @GetMapping("/qrcode/{merchantId}")
    public Object cerateQR(@PathVariable("merchantId") Long merchantId) throws WriterException, IOException {
        Object Qr = qrService.cerateQR(merchantId);
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(Qr);
    }

}
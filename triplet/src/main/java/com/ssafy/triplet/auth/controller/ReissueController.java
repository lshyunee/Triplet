package com.ssafy.triplet.auth.controller;

import com.ssafy.triplet.auth.jwt.JwtUtil;
import com.ssafy.triplet.response.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ReissueController {

    private final JwtUtil jwtUtil;

    @PostMapping("/api/v1/reissue") // refresh 토큰도 함께 재발급하도록 하면 좋음
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        // 원래 로직은 service로 넘기는게 맞음

        // refresh 토큰 가져오기
        String refresh = request.getHeader("Authorization-Refresh");
        // 토큰 검증
        if (refresh == null || !refresh.startsWith("Bearer ")) {
            return new ResponseEntity<>("refresh token null", HttpStatus.UNAUTHORIZED);
        }
        // 토큰 만료 체크
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            return new ResponseEntity<>("refresh token expired", HttpStatus.UNAUTHORIZED);
        }
        // 토큰이 refresh 인지 확인
        String category = jwtUtil.getCategory(refresh);
        if (!"refresh".equals(category)) {
            return new ResponseEntity<>("invalid refresh token", HttpStatus.UNAUTHORIZED);
        }

        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);
        // 새 access 토큰 발급
        String newAccess = jwtUtil.createJwt("access", username, role, 600000L);
        response.setHeader("Authorization", "Bearer " + newAccess);

        return new ResponseEntity<>(new ApiResponse <Void>("200", "access 재발급 성공"), HttpStatus.OK);
    }

}

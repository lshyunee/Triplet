package com.ssafy.triplet.auth.controller;

import com.ssafy.triplet.auth.jwt.JwtUtil;
import com.ssafy.triplet.response.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ReissueController {

    private final JwtUtil jwtUtil;

    @PostMapping("/api/v1/reissue") // refresh 토큰도 함께 재발급하도록 하면 좋음
    public ResponseEntity<?> reissue(HttpServletRequest request, HttpServletResponse response) {
        // 원래 로직은 service로 넘기는게 맞음
        // 쿠키에서 refresh 토큰 가져오기
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("Authorization-Refresh".equals(cookie.getName())) {
                    refresh = cookie.getValue();
                }
            }
        }

        // 토큰 검증
        if (refresh == null) {
            return new ResponseEntity<>(new ApiResponse<Void>("M0011", "토큰이 비어있습니다."), HttpStatus.UNAUTHORIZED);
        }

        // 토큰 만료 체크
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            return new ResponseEntity<>(new ApiResponse<Void>("M0012", "토큰이 만료되었습니다."), HttpStatus.UNAUTHORIZED);
        }

        // 토큰이 refresh 인지 확인
        String category = jwtUtil.getCategory(refresh);
        if (!"refresh".equals(category)) {
            return new ResponseEntity<>(new ApiResponse<Void>("M0018", "토큰이 유효하지 않습니다."), HttpStatus.UNAUTHORIZED);
        }

        String username = jwtUtil.getUsername(refresh);
        String role = jwtUtil.getRole(refresh);
        // 새 access, refresh 토큰 발급
        String newAccess = jwtUtil.createJwt("access", username, role, 1200000L);
        String newRefresh = jwtUtil.createJwt("refresh", username, role, 14400000L);
        response.addCookie(createCookie("Authorization", newAccess));
        response.addCookie(createCookie("Authorization-Refresh", newRefresh));

        return new ResponseEntity<>(new ApiResponse <Void>("200", "access 재발급 성공"), HttpStatus.OK);
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge(24*60*60);
        cookie.setSecure(true);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        return cookie;
    }

}

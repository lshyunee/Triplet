package com.ssafy.triplet.auth.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class CustomLogoutFilter extends GenericFilterBean {

    private final JwtUtil jwtUtil;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        doFilter((HttpServletRequest) request, (HttpServletResponse) response, filterChain);
    }

    private void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        // path, method 검증
        String requestURI = request.getRequestURI();
        if (!requestURI.matches("^/api/v1/logout$")) { // logout 경로가 아니면 다음 필터로
            filterChain.doFilter(request, response);
            return;
        }
        String method = request.getMethod();
        if (!"POST".equals(method)) { // POST 요청이 아니면 다음 필터로
            filterChain.doFilter(request, response);
            return;
        }
        // refresh 토큰 꺼내기
        String refresh = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("Authorization-Refresh".equals(cookie.getName())) {
                    refresh = cookie.getValue();
                }
            }
        }

        // refresh 가 null 인지 확인
        if (refresh == null) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        // 토큰이 만료되었는지 확인
        // 만료되었다면 이미 로그아웃이므로 BAD_REQUEST
        try {
            jwtUtil.isExpired(refresh);
        } catch (ExpiredJwtException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        // 토큰이 refresh 인지 access 인지 확인
        String category = jwtUtil.getCategory(refresh);
        if (!"refresh".equals(category)) { // refresh 가 아니면 BAD_REQUEST
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
        // access, refresh 토큰 Cookie 삭제
        Cookie refreshCookie = new Cookie("Authorization-Refresh", null);
        refreshCookie.setMaxAge(0);
        refreshCookie.setPath("/");
        refreshCookie.setSecure(true);
        refreshCookie.setHttpOnly(true);

        Cookie accessCookie = new Cookie("Authorization", null);
        accessCookie.setMaxAge(0);
        accessCookie.setPath("/");
        accessCookie.setSecure(true);
        accessCookie.setHttpOnly(true);

        response.addCookie(refreshCookie);
        response.addCookie(accessCookie);
        response.setStatus(HttpServletResponse.SC_OK);

        // JSON 응답 만들기
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("code", "200");
        responseBody.put("message", "로그아웃 성공");

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(responseBody);

        // JSON 응답 쓰기
        response.getWriter().write(jsonResponse);
        response.setStatus(HttpStatus.OK.value());
    }
}

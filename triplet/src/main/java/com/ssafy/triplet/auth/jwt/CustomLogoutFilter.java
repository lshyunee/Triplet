package com.ssafy.triplet.auth.jwt;

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
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

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
        if (!requestURI.matches("^/logout$")) { // logout 경로가 아니면 다음 필터로
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
        for (Cookie cookie : cookies) {
            if ("refresh".equals(cookie.getName())) {
                refresh = cookie.getValue().split(" ")[1];
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
        // refresh 토큰 Cookie 값 0
        Cookie cookie = new Cookie("refresh", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setSecure(true);
        cookie.setHttpOnly(true);

        response.addCookie(cookie);
        response.setStatus(HttpServletResponse.SC_OK);
    }
}

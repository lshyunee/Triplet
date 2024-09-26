package com.ssafy.triplet.auth.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.triplet.auth.dto.CustomUserPrincipal;
import com.ssafy.triplet.auth.dto.MemberAuthDto;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // 아래 경로에 포함되면 jwt검사 생략
        List<String> whiteList = List.of(
                "/error",
                "/api/v1/login",
                "/api/v1/signup",
                "/api/v1/reissue",
                "/api/v1/sms",
                "/api/v1/oauth2/authorization"
        );
        String requestURI = request.getRequestURI();
        log.info("requestURI: {}", requestURI);
        if (whiteList.stream().anyMatch(requestURI::startsWith)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 쿠키에서 access 토큰 가져옴
        String accessToken = null;
        Cookie[] cookies = request.getCookies();
        log.info("cookies: {}", cookies);
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("Authorization".equals(cookie.getName())) {
                    accessToken = cookie.getValue();
                }
            }
        }

        // access 토큰 검증
        if (accessToken == null) {
            log.info("token null");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("code", "M0011");
            responseBody.put("message", "토큰이 비어있습니다.");

            ObjectMapper objectMapper = new ObjectMapper();
            String jsonResponse = objectMapper.writeValueAsString(responseBody);

            // JSON 응답 쓰기
            response.getWriter().write(jsonResponse);
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return; // 조건에 해당되면 메서드 종료
        }

        // 토큰 소멸 시간 검증
        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) { // 만료된 토큰이면 다음 필터로 넘기지 않음
            log.info("token expired");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("code", "M0012");
            responseBody.put("message", "토큰이 만료되었습니다.");

            ObjectMapper objectMapper = new ObjectMapper();
            String jsonResponse = objectMapper.writeValueAsString(responseBody);

            // JSON 응답 쓰기
            response.getWriter().write(jsonResponse);
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return;
        }

        String category = jwtUtil.getCategory(accessToken);

        // 토큰이 access 인지 확인
        if (!"access".equals(category)) {
            log.info("invalid access token");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("code", "M0018");
            responseBody.put("message", "토큰이 유효하지 않습니다.");

            ObjectMapper objectMapper = new ObjectMapper();
            String jsonResponse = objectMapper.writeValueAsString(responseBody);

            // JSON 응답 쓰기
            response.getWriter().write(jsonResponse);
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            return;
        }

        // 사용자 정보 생성
        String username = jwtUtil.getUsername(accessToken);
        String role = jwtUtil.getRole(accessToken);

        MemberAuthDto memberAuthDto = new MemberAuthDto(username, role);
        CustomUserPrincipal customUserPrincipal = new CustomUserPrincipal(memberAuthDto);

        // 인증 토큰 생성
        Authentication authToken = new UsernamePasswordAuthenticationToken(customUserPrincipal, null, customUserPrincipal.getAuthorities());
        // 세션에 추가
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}

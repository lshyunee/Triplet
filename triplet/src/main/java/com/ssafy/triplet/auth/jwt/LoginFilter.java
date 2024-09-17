package com.ssafy.triplet.auth.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
public class LoginFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        // 요청에서 username, password 추출
        String username = request.getParameter("memberId");
        String password = request.getParameter("password");

        // token 에 담아 AuthenticationManager 로 전달
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(username, password);
        return authenticationManager.authenticate(authToken);
    }

    @Override // 로그인 성공시 동작할 메서드 -> jwt 발급
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authentication) throws IOException, ServletException {
        // username, role 얻기
        String username = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.iterator().next().getAuthority();

        // access, refresh 토큰 발급
        String access = jwtUtil.createJwt("access", username, role, 600000L);
        String refresh = jwtUtil.createJwt("refresh", username, role, 86400000L);

        // 응답에 토큰 정보 담기
        response.setHeader("Authorization", "Bearer/" + access);
        response.addCookie(createCookie("refresh", "Bearer/" + refresh));

        // JSON 응답 만들기
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("code", "200");
        responseBody.put("message", "로그인 성공");

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(responseBody);

        // JSON 응답 쓰기
        response.getWriter().write(jsonResponse);
        response.setStatus(HttpStatus.OK.value());
    }

    @Override // 로그인 실패시 동작할 메서드
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        Map<String, Object> responseBody = new HashMap<>();

        if (failed instanceof UsernameNotFoundException) {
            // 존재하지 않는 아이디
            responseBody.put("code", "M0002");
            responseBody.put("message", "아이디가 유효하지 않습니다.");
        } else {
            // 비밀번호가 일치하지 않음
            responseBody.put("code", "M0009");
            responseBody.put("message", "회원 정보가 일치하지 않습니다.");
        }

        ObjectMapper objectMapper = new ObjectMapper();
        String jsonResponse = objectMapper.writeValueAsString(responseBody);

        response.getWriter().write(jsonResponse);
        response.setStatus(HttpStatus.BAD_REQUEST.value());
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

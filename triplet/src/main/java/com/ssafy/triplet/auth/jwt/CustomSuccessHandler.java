package com.ssafy.triplet.auth.jwt;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        // username, role 얻기
        String username = authentication.getName();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.iterator().next().getAuthority();

        // access, refresh 토큰 발급
        String access = jwtUtil.createJwt("access", username, role, 1200000L);
        String refresh = jwtUtil.createJwt("refresh", username, role, 14400000L);

        // 쿠키에 토큰 정보 담기
        Cookie authorization = createCookie("Authorization", access);
        response.addHeader("Set-Cookie", authorization.getName() + "=" + authorization.getValue()
                + "; Path=" + authorization.getPath()
                + "; Max-Age=" + authorization.getMaxAge()
                + "; HttpOnly"
                + (authorization.getSecure() ? "; Secure" : "")
                + "; SameSite=None");

        Cookie authorizationRefresh = createCookie("Authorization-Refresh", refresh);
        response.addHeader("Set-Cookie", authorizationRefresh.getName() + "=" + authorizationRefresh.getValue()
                + "; Path=" + authorizationRefresh.getPath()
                + "; Max-Age=" + authorizationRefresh.getMaxAge()
                + "; HttpOnly"
                + (authorizationRefresh.getSecure() ? "; Secure" : "")
                + "; SameSite=None");
        // 클라이언트로 redirect
        response.sendRedirect("https://j11b202.p.ssafy.io/mypage/info-set");
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

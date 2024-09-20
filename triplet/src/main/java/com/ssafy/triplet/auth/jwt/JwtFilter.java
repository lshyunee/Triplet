package com.ssafy.triplet.auth.jwt;

import com.ssafy.triplet.auth.dto.CustomMemberDetails;
import com.ssafy.triplet.auth.dto.MemberAuthDto;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.PrintWriter;

@Slf4j
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        // login or oauth2 면 jwt 검사안하고 넘기기
        String requestURI = request.getRequestURI();

        if (requestURI.matches("^\\/login(?:\\/.*)?$") || requestURI.matches("^\\/oauth2(?:\\/.*)?$")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 쿠키에서 access 토큰 가져옴
        String accessToken = null;
        Cookie[] cookies = request.getCookies();
        for (Cookie cookie : cookies) {
            if ("Authorization".equals(cookie.getName())) {
                accessToken = cookie.getValue();
            }
        }

        // access 토큰 검증
        if (accessToken == null) {
            log.info("token null");
            filterChain.doFilter(request, response);
            return; // 조건에 해당되면 메서드 종료
        }

        // 토큰 소멸 시간 검증
        try {
            jwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) { // 만료된 토큰이면 다음 필터로 넘기지 않음
            log.info("token expired");
            PrintWriter writer = response.getWriter();
            writer.print("access token expired");

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String category = jwtUtil.getCategory(accessToken);

        // 토큰이 access 인지 확인
        if (!"access".equals(category)) {
            log.info("invalid access token");
            PrintWriter writer = response.getWriter();
            writer.print("invalid access token");

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        // 사용자 정보 생성
        String username = jwtUtil.getUsername(accessToken);
        String role = jwtUtil.getRole(accessToken);

        MemberAuthDto memberAuthDto = new MemberAuthDto(username, role);
        CustomMemberDetails customMemberDetails = new CustomMemberDetails(memberAuthDto);

        // 인증 토큰 생성
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(customMemberDetails, null, customMemberDetails.getAuthorities());
        // 세션에 추가
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}

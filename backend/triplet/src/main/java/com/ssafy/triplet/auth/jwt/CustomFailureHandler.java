package com.ssafy.triplet.auth.jwt;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Slf4j
@Component
public class CustomFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        log.info("onAuthenticationFailure");
        // 실패 원인 로그 남기기
        if (exception instanceof OAuth2AuthenticationException oauthException) {
            // OAuth2 인증 실패 원인
            System.out.println("OAuth2 인증 실패: " + oauthException.getError().getErrorCode());
        } else {
            // 일반적인 인증 실패 원인 (예: 자격 증명 오류)
            System.out.println("인증 실패 원인: " + exception.getMessage());
        }
        // 메시지랑 같이 redirect
        response.sendRedirect("https://j11b202.p.ssafy.io/login?error=true&message=" + exception.getMessage());
    }

}

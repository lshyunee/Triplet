package com.ssafy.triplet.auth.jwt;

import com.ssafy.triplet.auth.dto.CustomMemberDetails;
import com.ssafy.triplet.auth.service.CustomMemberDetailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CustomAuthenticationProvider implements AuthenticationProvider {

    private final CustomMemberDetailService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        // 값 안넘어올 경우 예외처리
        if (authentication.getName() == null || authentication.getName().trim().isEmpty()) {
            throw new UsernameNotFoundException("User not found");
        }
        if (authentication.getCredentials() == null) {
            throw new BadCredentialsException("Invalid password");
        }

        String username = authentication.getName();
        String password = authentication.getCredentials().toString();

        // CustomUserDetailsService를 사용하여 사용자 조회
        CustomMemberDetails user;
        try {
            user = (CustomMemberDetails) userDetailsService.loadUserByUsername(username);
        } catch (UsernameNotFoundException ex) {
            throw new UsernameNotFoundException("User not found");
        }

        // 비밀번호 일치 여부 확인
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadCredentialsException("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(user, password, user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}


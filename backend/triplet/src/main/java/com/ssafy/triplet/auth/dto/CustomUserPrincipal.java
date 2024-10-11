package com.ssafy.triplet.auth.dto;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

@RequiredArgsConstructor
public class CustomUserPrincipal implements UserDetails, OAuth2User {

    private final MemberAuthDto memberAuthDto;

    // 공용
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new GrantedAuthority() {
            @Override
            public String getAuthority() {
                return memberAuthDto.getRole();
            }
        });
        return authorities;
    }

    // 소셜 로그인용
    @Override
    public String getName() {
        return memberAuthDto.getMemberId();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    // 일반 로그인용
    @Override
    public String getPassword() {
        return memberAuthDto.getPassword();
    }

    @Override
    public String getUsername() {
        return memberAuthDto.getMemberId();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public String getMemberId() {
        return memberAuthDto.getMemberId();
    }
}

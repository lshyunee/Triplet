package com.ssafy.triplet.auth.service;

import com.ssafy.triplet.account.service.AccountService;
import com.ssafy.triplet.auth.dto.*;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;
    private final AccountService accountService;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("loadUser");
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response;
        // 소셜로그인 종류별로 추가 가능
        if ("kakao".equals(registrationId)) {
            oAuth2Response = new KakaoUserDetails(oAuth2User.getAttributes());
        } else {
            return null;
        }

        String username = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();

        Member existData = memberRepository.findByMemberId(username);

        if (existData == null) {
            // 새 유저 생성
            Member member = Member.builder()
                    .memberId(username)
                    .role("ROLE_USER")
                    .build();

            Member savedMember = memberRepository.save(member);
            // 계좌 자동생성
            accountService.createAccount(savedMember);
            accountService.generateForeignAccounts(savedMember);
            MemberAuthDto memberAuthDto = new MemberAuthDto(username, "ROLE_USER");

            return new CustomUserPrincipal(memberAuthDto);
        } else {
            MemberAuthDto memberAuthDto = new MemberAuthDto(username, existData.getRole());

            return new CustomUserPrincipal(memberAuthDto);
        }

    }
}

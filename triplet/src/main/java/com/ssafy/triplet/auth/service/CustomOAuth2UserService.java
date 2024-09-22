package com.ssafy.triplet.auth.service;

import com.ssafy.triplet.auth.dto.*;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final MemberRepository memberRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response;
        // 소셜로그인 종류별로 추가 가능
        if ("naver".equals(registrationId)) {
            oAuth2Response = new NaverResponse(oAuth2User.getAttributes());
        } else {
            return null;
        }

        String username = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();
        boolean gender = "M".equals(oAuth2Response.getGender()); // 1: 남, 0: 여
        // 생년월일 6자리로 만들기
        String birth = oAuth2Response.getBirthyear().substring(2)
                        + oAuth2Response.getBirthday().replace("-", "");

        Member existData = memberRepository.findByMemberId(username);

        if (existData == null) {
            Member member = Member.builder()
                    .memberId(username)
                    .name(oAuth2Response.getName())
                    .birth(birth)
                    .gender(gender)
                    .phoneNumber(oAuth2Response.getMobile())
                    .role("ROLE_USER")
                    .build();

            memberRepository.save(member);
            MemberAuthDto memberAuthDto = new MemberAuthDto(username, "ROLE_USER");

            return new CustomUserPrincipal(memberAuthDto);
        } else {
            existData.setName(oAuth2Response.getName());
            existData.setBirth(birth);
            existData.setGender(gender);
            existData.setPhoneNumber(oAuth2Response.getMobile());

            memberRepository.save(existData);
            MemberAuthDto memberAuthDto = new MemberAuthDto(username, existData.getRole());

            return new CustomUserPrincipal(memberAuthDto);
        }

    }
}

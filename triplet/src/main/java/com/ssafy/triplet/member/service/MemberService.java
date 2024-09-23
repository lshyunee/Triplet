package com.ssafy.triplet.member.service;

import com.ssafy.triplet.auth.jwt.JwtUtil;
import com.ssafy.triplet.exception.CustomException;
import com.ssafy.triplet.member.dto.request.*;
import com.ssafy.triplet.member.dto.response.MemberResponse;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.exception.CustomErrorCode;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public void signUp(SignupRequest request, HttpServletResponse response) {

        // 아이디 중복확인
        Member existMember = memberRepository.findByMemberId(request.getMemberId());
        if (existMember != null) {
            throw new CustomException(CustomErrorCode.ID_ALREADY_REGISTERED);
        }

        // 비밀번호 확인
        if (request.getPasswordConfirm() == null || !request.getPassword().equals(request.getPasswordConfirm())) {
            throw new CustomException(CustomErrorCode.PASSWORD_MISMATCH);
        }

        // 주민번호에서 생일, 성별 꺼내기
        String identificationNumber = request.getIdentificationNumber();
        String birth = identificationNumber.substring(0, 6);

        String lastNum = identificationNumber.substring(6);
        boolean gender = "1".equals(lastNum) || "3".equals(lastNum); // 1: 남, 0: 여

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        Member member = Member.builder()
                .memberId(request.getMemberId())
                .password(encodedPassword)
                .name(request.getName())
                .birth(birth)
                .gender(gender)
                .phoneNumber(request.getPhoneNumber())
                .role("ROLE_USER")
                .build();
        // 회원가입
        memberRepository.save(member);
        // 자동 로그인 처리 (토큰발급)
        autoLogin(request.getMemberId(), response);
    }

    public boolean createSimplePassword(SimplePasswordRequest request, String memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        // 간편비밀번호랑 간편비밀번호확인 검증
        if (!request.getNewSimplePassword().equals(request.getNewSimplePasswordConfirm())) {
            return false;
        }
        member.setSimplePassword(request.getNewSimplePassword());
        return true;
    }

    public boolean confirmSimplePassword(SimplePasswordConfirmRequest request, String memberId) {
        // 간편비밀번호 확인: true -> 확인 성공
        Member member = memberRepository.findByMemberId(memberId);
        return request.getSimplePassword().equals(member.getSimplePassword());
    }

    public boolean isDuplicated(MemberIdRequest request) {
        // 아이디 중복검사: true -> 중복
        Member existData = memberRepository.findByMemberId(request.getMemberId());
        return existData != null;
    }

    public MemberResponse findMyInfo(String memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        return MemberResponse.builder()
                .memberId(member.getMemberId())
                .name(member.getName())
                .phoneNumber(member.getPhoneNumber())
                .birth(member.getBirth())
                .gender(member.getGender()).build();
    }

    public MemberResponse updateMyInfo(MemberUpdateRequest request, String memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        // 주민번호에서 생일, 성별 꺼내기
        String identificationNumber = request.getIdentificationNumber();
        String birth = identificationNumber.substring(0, 6);
        String lastNum = identificationNumber.substring(6);
        boolean gender = "1".equals(lastNum) || "3".equals(lastNum); // 1: 남, 0: 여
        // 업데이트
        member.setGender(gender);
        member.setBirth(birth);
        member.setName(request.getName());
        member.setPhoneNumber(request.getPhoneNumber());
        // 변경된 정보 반환
        return MemberResponse.builder()
                .memberId(member.getMemberId())
                .name(request.getName())
                .phoneNumber(request.getPhoneNumber())
                .birth(birth)
                .gender(gender).build();
    }

    public void updatePassword(PasswordUpdateRequest request, String memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        // 입력한 기존 비밀번호랑 실제 내 비밀번호 일치하는지 확인
        if (!passwordEncoder.matches(request.getPassword(), member.getPassword())) {
            throw new CustomException(CustomErrorCode.INCORRECT_PASSWORD);
        }
        // 새 비밀번호랑 새 비밀번호 확인이 일치하는지 확인
        if (!request.getNewPassword().equals(request.getNewPasswordConfirm())) {
            throw new CustomException(CustomErrorCode.PASSWORD_MISMATCH);
        }
        member.setPassword(request.getNewPassword());
    }

    public void deleteMyInfo(String memberId) {
        Member member = memberRepository.findByMemberId(memberId);
        if (member == null) {
            throw new CustomException(CustomErrorCode.MEMBER_NOT_FOUND);
        }
        memberRepository.delete(member);
    }

    private void autoLogin(String memberId, HttpServletResponse response) {
        // access, refresh 토큰 발급
        String access = jwtUtil.createJwt("access", memberId, "ROLE_USER", 600000L);
        String refresh = jwtUtil.createJwt("refresh", memberId, "ROLE_USER", 86400000L);

        // 쿠키에 토큰 정보 담기
        response.addCookie(createCookie("Authorization", access));
        response.addCookie(createCookie("Authorization-Refresh", refresh));
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

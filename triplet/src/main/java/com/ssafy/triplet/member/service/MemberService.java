package com.ssafy.triplet.member.service;

import com.ssafy.triplet.member.dto.request.SignupRequest;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import com.ssafy.triplet.response.ApiResponse;
import com.ssafy.triplet.response.CustomErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public ApiResponse<?> singUp(SignupRequest request) {

        // 아이디 중복확인
        Member existMember = memberRepository.findByMemberId(request.getMemberId());
        if (existMember != null) {
            return ApiResponse.isError(CustomErrorCode.ID_ALREADY_REGISTERED);
        }

        // 비밀번호 확인
        if (request.getPasswordConfirm() == null || !request.getPassword().equals(request.getPasswordConfirm())) {
            return ApiResponse.isError(CustomErrorCode.PASSWORD_MISMATCH);
        }

        // 주민번호에서 생일, 성별 꺼내기
        String identificationNumber = request.getIdentificationNumber();
        String birth = identificationNumber.substring(0, 6);
        boolean gender = Boolean.parseBoolean(identificationNumber.substring(6));

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        Member member = Member.builder()
                .memberId(request.getMemberId())
                .password(encodedPassword)
                .name(request.getName())
                .birth(birth)
                .gender(gender)
                .simplePassword(request.getSimplePassword())
                .phoneNumber(request.getPhoneNumber())
                .role("ROLE_USER")
                .build();

        memberRepository.save(member);
        return new ApiResponse<Void>("200", "회원가입 성공");
    }

}

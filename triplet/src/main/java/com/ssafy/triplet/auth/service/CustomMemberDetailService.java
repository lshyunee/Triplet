package com.ssafy.triplet.auth.service;

import com.ssafy.triplet.auth.dto.CustomMemberDetails;
import com.ssafy.triplet.auth.dto.MemberAuthDto;
import com.ssafy.triplet.member.entity.Member;
import com.ssafy.triplet.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomMemberDetailService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String memberId) throws UsernameNotFoundException {
        Member member = memberRepository.findByMemberId(memberId);
        if (member != null) {
            MemberAuthDto memberAuthDto = new MemberAuthDto(member.getMemberId(), member.getRole());
            return new CustomMemberDetails(memberAuthDto);
        }
        return null;
    }
}

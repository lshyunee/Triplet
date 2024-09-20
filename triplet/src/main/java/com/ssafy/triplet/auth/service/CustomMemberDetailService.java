package com.ssafy.triplet.auth.service;

import com.ssafy.triplet.auth.dto.CustomUserPrincipal;
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
        if (member == null) {
            throw new UsernameNotFoundException("user not found");
        }
        MemberAuthDto memberAuthDto = new MemberAuthDto(member.getMemberId(), member.getPassword(), member.getRole());
        return new CustomUserPrincipal(memberAuthDto);
    }
}

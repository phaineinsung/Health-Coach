package com.team.health_coach.service;

import com.team.health_coach.entity.User;
import com.team.health_coach.repository.User_Repo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class UserDetail_Service implements UserDetailsService {

    private final User_Repo userRepository;

    // 이메일로 사용자 정보를 가져오는 메소드
    // 예외 처리 : 올바르지 않은 이메일 형식을 입력했을 경우
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        /*
        return userRepository.findByEmail(email)
                .map(this::createUserDetails)
                .orElseThrow(() -> new UsernameNotFoundException("해당하는 회원을 찾을 수 없습니다: " + email));
        */

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

            // 사용자 권한 가져오기
            List<GrantedAuthority> authorities = user.getRoles().stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());

            return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPw(), authorities);


    }


    // 해당하는 User 의 데이터가 존재한다면 UserDetails 객체로 만들어서 return
    private UserDetails createUserDetails(User user) {
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPw()) // 이미 암호화된 비밀번호
                .authorities(user.getRoles().stream()
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList()))
                .build();
    }

    // 사용자 권한 정보를 로드하는 메서드
    public Collection<? extends GrantedAuthority> loadUserAuthorities(String username) {
        Optional<User> userOptional = userRepository.findByEmail(username);

        if (userOptional.isEmpty()) {
            throw new RuntimeException("사용자를 찾을 수 없습니다.");
        }

        User user = userOptional.get();

        // User 객체의 getAuthorities() 메서드를 사용하여 권한 정보를 반환
        return user.getAuthorities();
    }
}

package com.team.health_coach.service;

import com.team.health_coach.dto.User_DTO;
import com.team.health_coach.entity.User;
import com.team.health_coach.repository.User_Repo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Service
public class User_Service {

    private final User_Repo userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;


    // 사용자 생성
    public void save(User_DTO userDTO) {
        // 기본 역할 "USER"를 리스트로 생성
        List<String> defaultRoles = List.of("USER");

        User user = User.builder()
                .email(userDTO.getEmail())
                .name(userDTO.getName())
                .roles(defaultRoles)
                .pw(bCryptPasswordEncoder.encode(userDTO.getPw()))  // pw 암호화
                .build();
        userRepository.save(user);
    }

    // 모든 사용자 정보 조회
    public List<User_DTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new User_DTO(user.getUserNum(), user.getEmail(), user.getName(), user.getPw()))
                .collect(Collectors.toList());
    }

    // 특정 사용자 정보 조회
    public Optional<User_DTO> getUserById(Long userNum) {
        return userRepository.findById(userNum)
                .map(user -> new User_DTO(user.getUserNum(), user.getEmail(), user.getName(), user.getPw()));
    }

    // 사용자 정보 수정
    public User_DTO updateUser(Long userNum, User_DTO userDTO) {
        User user = userRepository.findById(userNum)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setEmail(userDTO.getEmail());
        user.setName(userDTO.getName());
        user.setPw(bCryptPasswordEncoder.encode(userDTO.getPw())); // 비밀번호 암호화 추가
        userRepository.save(user);
        return new User_DTO(user.getUserNum(), user.getEmail(), user.getName(), user.getPw());
    }

    // 사용자 정보 삭제
    public void deleteUser(Long userNum) {
        userRepository.deleteById(userNum);
    }

    // 사용자 이메일로 조회
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
/*
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

 */
}

package com.team.health_coach.repository;

import com.team.health_coach.entity.Star;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Star_Repo extends JpaRepository<Star, Long> {
    List<Star> findByUser_UserNum(Long userNum); // 올바른 필드 이름 사용
}

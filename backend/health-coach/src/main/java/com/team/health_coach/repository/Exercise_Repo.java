package com.team.health_coach.repository;

import com.team.health_coach.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Exercise_Repo extends JpaRepository<Exercise, Long> {
    // 추가적으로 필요한 쿼리 메서드가 있다면 여기에 작성
}

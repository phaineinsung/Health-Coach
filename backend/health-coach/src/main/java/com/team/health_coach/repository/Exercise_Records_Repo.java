package com.team.health_coach.repository;

import com.team.health_coach.entity.Exercise_Records;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Exercise_Records_Repo extends JpaRepository<Exercise_Records, Long> {
    List<Exercise_Records> findByUser_UserNum(Long userNum); // 카멜 케이스로 수정
}

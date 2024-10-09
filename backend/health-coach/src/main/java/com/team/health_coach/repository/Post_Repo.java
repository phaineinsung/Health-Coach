package com.team.health_coach.repository;

import com.team.health_coach.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface Post_Repo extends JpaRepository<Post, Long> {
    void deleteByUser_UserNum(Long userNum);
}

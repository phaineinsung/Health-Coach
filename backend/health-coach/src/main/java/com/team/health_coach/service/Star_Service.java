package com.team.health_coach.service;

import com.team.health_coach.dto.Star_DTO;
import com.team.health_coach.entity.Star;
import com.team.health_coach.entity.User;
import com.team.health_coach.entity.Post;
import com.team.health_coach.repository.Star_Repo;
import com.team.health_coach.repository.User_Repo;
import com.team.health_coach.repository.Post_Repo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class Star_Service {

    private final Star_Repo starRepository;
    private final User_Repo userRepository;
    private final Post_Repo postRepository;

    // CREATE
    @Transactional
    public Star_DTO createStar(Star_DTO starDTO) {
        Star star = new Star();
        Optional<User> user = userRepository.findById(starDTO.getUser_num());
        Optional<Post> post = postRepository.findById(starDTO.getPost_id());

        if (user.isPresent() && post.isPresent()) {
            star.setUser(user.get());
            star.setPost(post.get());
            starRepository.save(star);
            return new Star_DTO(star.getStarId(), user.get().getUserNum(), post.get().getPostId());
        } else {
            throw new RuntimeException("User or Post not found");
        }
    }

    // READ
    public List<Star_DTO> getAllStarsByUser(Long user_num) {
        return starRepository.findByUser_UserNum(user_num).stream()
                .map(star -> new Star_DTO(star.getStarId(), star.getUser().getUserNum(), star.getPost().getPostId()))
                .collect(Collectors.toList());
    }

    public Optional<Star_DTO> getStarById(Long star_id) {
        return starRepository.findById(star_id)
                .map(star -> new Star_DTO(star.getStarId(), star.getUser().getUserNum(), star.getPost().getPostId()));
    }

    // DELETE
    @Transactional
    public void deleteStar(Long star_id) {
        starRepository.deleteById(star_id);
    }
}

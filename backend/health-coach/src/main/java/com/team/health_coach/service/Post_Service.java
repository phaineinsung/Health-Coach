package com.team.health_coach.service;

import com.team.health_coach.dto.Post_DTO;
import com.team.health_coach.entity.Ctg_Post;
import com.team.health_coach.entity.Post;
import com.team.health_coach.entity.User;
import com.team.health_coach.repository.Ctg_Post_Repo;
import com.team.health_coach.repository.Post_Repo;
import com.team.health_coach.repository.User_Repo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class Post_Service {

    @Autowired
    private final Post_Repo postRepository;

    @Autowired
    private final User_Repo userRepository;

    @Autowired
    private final Ctg_Post_Repo ctgPostRepository;

    // CREATE
    public Post_DTO createPost(Post_DTO postDTO) {
        User user = userRepository.findById(postDTO.getUserNum())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + postDTO.getUserNum()));

        Ctg_Post ctgPost = ctgPostRepository.findById(postDTO.getCtgId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + postDTO.getCtgId()));

        Post post = new Post();
        post.setUser(user);
        post.setCtgPost(ctgPost);
        post.setContent(postDTO.getContent());
        post.setTitle(postDTO.getTitle());
        post.setImage(postDTO.getImage());

        postRepository.save(post);

        return new Post_DTO(post.getPostId(), post.getUser().getUserNum(), post.getCtgPost().getCtgId(), post.getContent(), post.getTitle(), post.getUploadDate(), post.getImage());
    }

    // READ
    public List<Post_DTO> getAllPosts() {
        return postRepository.findAll().stream()
                .map(post -> new Post_DTO(post.getPostId(), post.getUser().getUserNum(), post.getCtgPost().getCtgId(), post.getContent(), post.getTitle(), post.getUploadDate(), post.getImage()))
                .collect(Collectors.toList());
    }

    public Optional<Post_DTO> getPostById(Long postId) {
        return postRepository.findById(postId)
                .map(post -> new Post_DTO(post.getPostId(), post.getUser().getUserNum(), post.getCtgPost().getCtgId(), post.getContent(), post.getTitle(), post.getUploadDate(), post.getImage()));
    }

    // UPDATE
    public Post_DTO updatePost(Long postId, Post_DTO postDTO) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found with id: " + postId));

        Ctg_Post ctgPost = ctgPostRepository.findById(postDTO.getCtgId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + postDTO.getCtgId()));

        post.setCtgPost(ctgPost);
        post.setContent(postDTO.getContent());
        post.setTitle(postDTO.getTitle());
        post.setImage(postDTO.getImage());

        postRepository.save(post);

        return new Post_DTO(post.getPostId(), post.getUser().getUserNum(), post.getCtgPost().getCtgId(), post.getContent(), post.getTitle(), post.getUploadDate(), post.getImage());
    }

    // DELETE
    public void deletePost(Long postId) {
        postRepository.deleteById(postId);
    }
}

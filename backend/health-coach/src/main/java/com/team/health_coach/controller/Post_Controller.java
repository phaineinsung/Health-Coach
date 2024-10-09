package com.team.health_coach.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.team.health_coach.dto.Post_DTO;
import com.team.health_coach.service.Post_Service;

@RestController
@RequestMapping("/posts")
public class Post_Controller {

    @Autowired
    private Post_Service postService;

    // 게시글 생성
    @PostMapping
    public ResponseEntity<Post_DTO> createPost(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("email") String email,
            @RequestParam("ctg_id") Long ctg_id,
            @RequestParam("user_num") Long user_num,
            @RequestParam(value = "imageUrl", required = false) String imageUrl) {

        Post_DTO postDTO = new Post_DTO();
        postDTO.setTitle(title);
        postDTO.setContent(content);
        postDTO.setImage(imageUrl);
        postDTO.setUserNum(user_num);
        postDTO.setCtgId(ctg_id);

        Post_DTO createdPost = postService.createPost(postDTO);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    // 게시글 전체 목록 조회
    @GetMapping
    public ResponseEntity<List<Post_DTO>> getAllPosts() {
        return new ResponseEntity<>(postService.getAllPosts(), HttpStatus.OK);
    }

    // 특정 게시글 조회
    @GetMapping("/{post_id}")
    public ResponseEntity<Post_DTO> getPostById(@PathVariable Long post_id) {
        return postService.getPostById(post_id)
                .map(post -> new ResponseEntity<>(post, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 게시글 수정
    @PutMapping("/{post_id}")
    public ResponseEntity<Post_DTO> updatePost(
            @PathVariable Long post_id,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("email") String email,
            @RequestParam("ctg_id") Long ctg_id,
            @RequestParam("user_num") Long user_num,
            @RequestParam(value = "imageUrl", required = false) String imageUrl) {

        Post_DTO postDTO = new Post_DTO();
        postDTO.setTitle(title);
        postDTO.setContent(content);
        postDTO.setImage(imageUrl);
        postDTO.setUserNum(user_num);
        postDTO.setCtgId(ctg_id);

        Post_DTO updatedPost = postService.updatePost(post_id, postDTO);
        return new ResponseEntity<>(updatedPost, HttpStatus.OK);
    }

    // 게시글 삭제
    @DeleteMapping("/{post_id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long post_id) {
        postService.deletePost(post_id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

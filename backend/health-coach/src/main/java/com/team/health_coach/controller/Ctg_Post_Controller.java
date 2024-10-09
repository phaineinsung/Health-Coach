package com.team.health_coach.controller;

import com.team.health_coach.dto.Ctg_Post_DTO;
import com.team.health_coach.service.Ctg_Post_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ctg_post")
public class Ctg_Post_Controller {

    @Autowired
    private Ctg_Post_Service ctgPostService;

    // 게시글 카테고리 생성
    @PostMapping
    public ResponseEntity<Ctg_Post_DTO> createCategory(@RequestBody Ctg_Post_DTO ctgPostDTO) {
        Ctg_Post_DTO createdCategory = ctgPostService.createCategory(ctgPostDTO);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    // 게시글 카테고리 전체 조회
    @GetMapping
    public ResponseEntity<List<Ctg_Post_DTO>> getAllCategories() {
        return new ResponseEntity<>(ctgPostService.getAllCategories(), HttpStatus.OK);
    }

    // 특정 카테고리 조회
    @GetMapping("/{ctg_id}")
    public ResponseEntity<Ctg_Post_DTO> getCategoryById(@PathVariable Long ctg_id) {
        return ctgPostService.getCategoryById(ctg_id)
                .map(category -> new ResponseEntity<>(category, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 카테고리 업데이트
    @PutMapping("/{ctg_id}")
    public ResponseEntity<Ctg_Post_DTO> updateCategory(@PathVariable Long ctg_id, @RequestBody Ctg_Post_DTO ctgPostDTO) {
        Ctg_Post_DTO updatedCategory = ctgPostService.updateCategory(ctg_id, ctgPostDTO);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    // 카테고리 삭제
    @DeleteMapping("/{ctg_id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long ctg_id) {
        ctgPostService.deleteCategory(ctg_id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}


package com.team.health_coach.controller;

import com.team.health_coach.dto.Ctg_Exercise_DTO;
import com.team.health_coach.service.Ctg_Exercise_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ctg_exercise")
public class Ctg_Exercise_Controller {

    @Autowired
    private Ctg_Exercise_Service ctgExerciseService;

    // 게시글 카테고리 생성
    @PostMapping
    public ResponseEntity<Ctg_Exercise_DTO> createCategory(@RequestBody Ctg_Exercise_DTO ctgExerciseDTO) {
        Ctg_Exercise_DTO createdCategory = ctgExerciseService.createExerciseCategory(ctgExerciseDTO);
        return new ResponseEntity<>(createdCategory, HttpStatus.CREATED);
    }

    // 게시글 카테고리 전체 조회
    @GetMapping
    public ResponseEntity<List<Ctg_Exercise_DTO>> getAllCategories() {
        return new ResponseEntity<>(ctgExerciseService.getAllExerciseCategories(), HttpStatus.OK);
    }

    // 특정 카테고리 조회
    @GetMapping("/{ctg_id}")
    public ResponseEntity<Ctg_Exercise_DTO> getCategoryById(@PathVariable Long ctg_id) {
        return ctgExerciseService.getExerciseCategoryById(ctg_id)
                .map(category -> new ResponseEntity<>(category, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 카테고리 업데이트
    @PutMapping("/{ctg_id}")
    public ResponseEntity<Ctg_Exercise_DTO> updateCategory(@PathVariable Long ctg_id, @RequestBody Ctg_Exercise_DTO ctgExerciseDTO) {
        Ctg_Exercise_DTO updatedCategory = ctgExerciseService.updateExerciseCategory(ctg_id, ctgExerciseDTO);
        return new ResponseEntity<>(updatedCategory, HttpStatus.OK);
    }

    // 카테고리 삭제
    @DeleteMapping("/{ctg_id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long ctg_id) {
        ctgExerciseService.deleteExerciseCategory(ctg_id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

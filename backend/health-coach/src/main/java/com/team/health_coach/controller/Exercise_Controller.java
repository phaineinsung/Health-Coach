package com.team.health_coach.controller;

import com.team.health_coach.dto.Exercise_DTO;
import com.team.health_coach.service.Exercise_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exercises")
public class Exercise_Controller {

    @Autowired
    private Exercise_Service exerciseService;

    // CREATE
    @PostMapping
    public ResponseEntity<Exercise_DTO> createExercise(@RequestBody Exercise_DTO exerciseDTO) {
        Exercise_DTO createdExercise = exerciseService.createExercise(exerciseDTO);
        return ResponseEntity.ok(createdExercise);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Exercise_DTO>> getAllExercises() {
        List<Exercise_DTO> exercises = exerciseService.getAllExercises();
        return ResponseEntity.ok(exercises);
    }

    // READ ONE
    @GetMapping("/{ex_id}")
    public ResponseEntity<Exercise_DTO> getExerciseById(@PathVariable Long ex_id) {
        Exercise_DTO exerciseDTO = exerciseService.getExerciseById(ex_id);
        return ResponseEntity.ok(exerciseDTO);
    }

    // UPDATE
    @PutMapping("/{ex_id}")
    public ResponseEntity<Exercise_DTO> updateExercise(@PathVariable Long ex_id, @RequestBody Exercise_DTO exerciseDTO) {
        Exercise_DTO updatedExercise = exerciseService.updateExercise(ex_id, exerciseDTO);
        return ResponseEntity.ok(updatedExercise);
    }

    // DELETE
    @DeleteMapping("/{ex_id}")
    public ResponseEntity<Void> deleteExercise(@PathVariable Long ex_id) {
        exerciseService.deleteExercise(ex_id);
        return ResponseEntity.noContent().build();
    }
}

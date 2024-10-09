package com.team.health_coach.service;

import com.team.health_coach.dto.Exercise_DTO;
import com.team.health_coach.entity.Exercise;
import com.team.health_coach.repository.Exercise_Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Exercise_Service {

    @Autowired
    private Exercise_Repo exerciseRepo;

    // CREATE
    public Exercise_DTO createExercise(Exercise_DTO exerciseDTO) {
        Exercise exercise = new Exercise();
        exercise.setExName(exerciseDTO.getExName());

        Exercise savedExercise = exerciseRepo.save(exercise);
        return convertToDTO(savedExercise);
    }

    // READ ALL
    public List<Exercise_DTO> getAllExercises() {
        return exerciseRepo.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // READ ONE
    public Exercise_DTO getExerciseById(Long exId) {
        Exercise exercise = exerciseRepo.findById(exId)
                .orElseThrow(() -> new RuntimeException("Exercise not found with id: " + exId));

        return convertToDTO(exercise);
    }

    // UPDATE
    public Exercise_DTO updateExercise(Long exId, Exercise_DTO exerciseDTO) {
        Exercise exercise = exerciseRepo.findById(exId)
                .orElseThrow(() -> new RuntimeException("Exercise not found with id: " + exId));

        exercise.setExName(exerciseDTO.getExName());

        Exercise updatedExercise = exerciseRepo.save(exercise);
        return convertToDTO(updatedExercise);
    }

    // DELETE
    public void deleteExercise(Long exId) {
        exerciseRepo.deleteById(exId);
    }

    // DTO 변환 메서드
    private Exercise_DTO convertToDTO(Exercise exercise) {
        return new Exercise_DTO(
                exercise.getExId(),
                exercise.getExName()
        );
    }
}

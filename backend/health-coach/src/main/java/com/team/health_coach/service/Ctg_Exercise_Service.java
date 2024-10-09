package com.team.health_coach.service;

import com.team.health_coach.dto.Ctg_Exercise_DTO;
import com.team.health_coach.entity.Ctg_Exercise;
import com.team.health_coach.repository.Ctg_Exercise_Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class Ctg_Exercise_Service {

    @Autowired
    private Ctg_Exercise_Repo repo;

    // CREATE
    public Ctg_Exercise_DTO createExerciseCategory(Ctg_Exercise_DTO exerciseDTO) {
        Ctg_Exercise exercise = new Ctg_Exercise();
        exercise.setCtg_name(exerciseDTO.getCtg_name());
        repo.save(exercise);
        return new Ctg_Exercise_DTO(exercise.getCtg_id(), exercise.getCtg_name());
    }

    // READ
    public List<Ctg_Exercise_DTO> getAllExerciseCategories() {
        return repo.findAll().stream()
                .map(exercise -> new Ctg_Exercise_DTO(exercise.getCtg_id(), exercise.getCtg_name()))
                .collect(Collectors.toList());
    }

    public Optional<Ctg_Exercise_DTO> getExerciseCategoryById(Long id) {
        return repo.findById(id)
                .map(exercise -> new Ctg_Exercise_DTO(exercise.getCtg_id(), exercise.getCtg_name()));
    }

    // UPDATE
    public Ctg_Exercise_DTO updateExerciseCategory(Long id, Ctg_Exercise_DTO exerciseDTO) {
        Ctg_Exercise exercise = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise category not found"));
        exercise.setCtg_name(exerciseDTO.getCtg_name());
        repo.save(exercise);
        return new Ctg_Exercise_DTO(exercise.getCtg_id(), exercise.getCtg_name());
    }

    // DELETE
    public void deleteExerciseCategory(Long id) {
        repo.deleteById(id);
    }
}

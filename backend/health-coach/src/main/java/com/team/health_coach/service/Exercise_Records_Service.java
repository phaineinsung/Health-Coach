package com.team.health_coach.service;

import com.team.health_coach.dto.Exercise_Records_DTO;
import com.team.health_coach.entity.Exercise_Records;
import com.team.health_coach.entity.Exercise;
import com.team.health_coach.entity.User;
import com.team.health_coach.repository.Exercise_Records_Repo;
import com.team.health_coach.repository.Exercise_Repo;
import com.team.health_coach.repository.User_Repo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class Exercise_Records_Service {

    @Autowired
    private Exercise_Records_Repo exerciseRecordsRepo;

    @Autowired
    private Exercise_Repo exerciseRepo;

    @Autowired
    private User_Repo userRepo;

    // CREATE
    public Exercise_Records_DTO createExerciseRecord(Exercise_Records_DTO recordsDTO) {
        User user = userRepo.findById(recordsDTO.getUserNum())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + recordsDTO.getUserNum()));

        Exercise exercise = exerciseRepo.findById(recordsDTO.getExId())
                .orElseThrow(() -> new RuntimeException("Exercise not found with id: " + recordsDTO.getExId()));

        Exercise_Records record = new Exercise_Records();
        record.setUser(user);
        record.setExercise(exercise);
        record.setExDate(recordsDTO.getExDate());
        record.setExTime(recordsDTO.getExTime());

        Exercise_Records savedRecord = exerciseRecordsRepo.save(record);

        return new Exercise_Records_DTO(
                savedRecord.getRecordId(),
                savedRecord.getUser().getUserNum(),
                savedRecord.getExercise().getExId(),
                savedRecord.getExDate(),
                savedRecord.getExTime()
        );
    }

    // READ ALL
    public List<Exercise_Records_DTO> getAllRecordsForUser(Long userNum) {
        return exerciseRecordsRepo.findByUser_UserNum(userNum).stream()
                .map(record -> new Exercise_Records_DTO(
                        record.getRecordId(),
                        record.getUser().getUserNum(),
                        record.getExercise().getExId(),
                        record.getExDate(),
                        record.getExTime()))
                .collect(Collectors.toList());
    }

    // READ ONE
    public Exercise_Records_DTO getRecordById(Long recordId) {
        Exercise_Records record = exerciseRecordsRepo.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Record not found with id: " + recordId));

        return new Exercise_Records_DTO(
                record.getRecordId(),
                record.getUser().getUserNum(),
                record.getExercise().getExId(),
                record.getExDate(),
                record.getExTime()
        );
    }

    // UPDATE
    public Exercise_Records_DTO updateExerciseRecord(Long recordId, Exercise_Records_DTO recordsDTO) {
        Exercise_Records record = exerciseRecordsRepo.findById(recordId)
                .orElseThrow(() -> new RuntimeException("Record not found with id: " + recordId));

        Exercise exercise = exerciseRepo.findById(recordsDTO.getExId())
                .orElseThrow(() -> new RuntimeException("Exercise not found with id: " + recordsDTO.getExId()));

        record.setExercise(exercise);
        record.setExDate(recordsDTO.getExDate());
        record.setExTime(recordsDTO.getExTime());

        Exercise_Records updatedRecord = exerciseRecordsRepo.save(record);

        return new Exercise_Records_DTO(
                updatedRecord.getRecordId(),
                updatedRecord.getUser().getUserNum(),
                updatedRecord.getExercise().getExId(),
                updatedRecord.getExDate(),
                updatedRecord.getExTime()
        );
    }

    // DELETE
    public void deleteExerciseRecord(Long recordId) {
        exerciseRecordsRepo.deleteById(recordId);
    }
}

package com.team.health_coach.controller;

import com.team.health_coach.dto.Exercise_Records_DTO;
import com.team.health_coach.service.Exercise_Records_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/mypage/{user_num}/records")
public class Exercise_Records_Controller {

    @Autowired
    private Exercise_Records_Service exerciseRecordsService;

    // 개인별 운동 기록 전체 조회
    @GetMapping
    public ResponseEntity<List<Exercise_Records_DTO>> getAllRecords(@PathVariable Long user_num) {
        List<Exercise_Records_DTO> records = exerciseRecordsService.getAllRecordsForUser(user_num);
        return ResponseEntity.ok(records);
    }

    // 개인별 운동 기록 특정 내용 조회
    @GetMapping("/{record_id}")
    public ResponseEntity<Exercise_Records_DTO> getRecordById(@PathVariable Long user_num, @PathVariable Long record_id) {
        Exercise_Records_DTO record = exerciseRecordsService.getRecordById(record_id);
        if (!record.getUserNum().equals(user_num)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(record);
    }

    // 개인별 운동 기록 추가
    @PostMapping
    public ResponseEntity<Exercise_Records_DTO> createRecord(@PathVariable Long user_num, @RequestBody Exercise_Records_DTO recordsDTO) {
        recordsDTO.setUserNum(user_num); // 올바른 메서드 호출
        Exercise_Records_DTO createdRecord = exerciseRecordsService.createExerciseRecord(recordsDTO);
        return ResponseEntity.ok(createdRecord);
    }

    // 개인별 운동 기록 수정
    @PutMapping("/{record_id}")
    public ResponseEntity<Exercise_Records_DTO> updateRecord(
            @PathVariable("user_num") Long userNum,
            @PathVariable("record_id") Long recordId,
            @RequestBody Exercise_Records_DTO recordsDTO) {

        // DTO 객체를 업데이트할 값으로 설정합니다.
        recordsDTO.setRecordId(recordId);
        recordsDTO.setUserNum(userNum);

        // 서비스 호출
        Exercise_Records_DTO updatedRecord = exerciseRecordsService.updateExerciseRecord(recordId, recordsDTO);

        // 응답으로 업데이트된 레코드를 반환합니다.
        return new ResponseEntity<>(updatedRecord, HttpStatus.OK);
    }

    // 개인별 운동 기록 삭제
    @DeleteMapping("/{record_id}")
    public ResponseEntity<Void> deleteRecord(@PathVariable Long user_num, @PathVariable Long record_id) {
        Exercise_Records_DTO record = exerciseRecordsService.getRecordById(record_id);
        if (!record.getUserNum().equals(user_num)) {
            return ResponseEntity.notFound().build();
        }
        exerciseRecordsService.deleteExerciseRecord(record_id);
        return ResponseEntity.noContent().build();
    }
}

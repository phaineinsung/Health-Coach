package com.team.health_coach.controller;

import com.team.health_coach.dto.Star_DTO;
import com.team.health_coach.service.Star_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/{user_num}/stars")
public class Star_Controller {

    @Autowired
    private Star_Service starService;

    // 즐겨찾기 추가
    @PostMapping
    public ResponseEntity<Star_DTO> createStar(@RequestBody Star_DTO starDTO) {
        Star_DTO createdStar = starService.createStar(starDTO);
        return new ResponseEntity<>(createdStar, HttpStatus.CREATED);
    }

    // 즐겨찾기 리스트 전체 내용 얻어오기
    @GetMapping
    public ResponseEntity<List<Star_DTO>> getAllStars(@PathVariable Long user_num) {
        return new ResponseEntity<>(starService.getAllStarsByUser(user_num), HttpStatus.OK);
    }

    // 특정 ID의 즐겨찾기 내용 가져오기
    @GetMapping("/{star_id}")
    public ResponseEntity<Star_DTO> getStarById(@PathVariable Long star_id) {
        return starService.getStarById(star_id)
                .map(star -> new ResponseEntity<>(star, HttpStatus.OK))
                .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // 특정 ID의 즐겨찾기 내용 삭제
    @DeleteMapping("/{star_id}")
    public ResponseEntity<Void> deleteStar(@PathVariable Long star_id) {
        starService.deleteStar(star_id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}

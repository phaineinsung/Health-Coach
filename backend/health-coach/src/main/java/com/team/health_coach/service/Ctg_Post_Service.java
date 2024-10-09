package com.team.health_coach.service;

import com.team.health_coach.dto.Ctg_Post_DTO;
import com.team.health_coach.entity.Ctg_Post;
import com.team.health_coach.repository.Ctg_Post_Repo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class Ctg_Post_Service {

    private final Ctg_Post_Repo ctgPostRepository;

    // CREATE
    public Ctg_Post_DTO createCategory(Ctg_Post_DTO ctgPostDTO) {
        Ctg_Post ctgPost = new Ctg_Post();
        ctgPost.setCtgName(ctgPostDTO.getCtgName());
        ctgPostRepository.save(ctgPost);
        return new Ctg_Post_DTO(ctgPost.getCtgId(), ctgPost.getCtgName());
    }

    // READ
    public List<Ctg_Post_DTO> getAllCategories() {
        return ctgPostRepository.findAll().stream()
                .map(ctgPost -> new Ctg_Post_DTO(ctgPost.getCtgId(), ctgPost.getCtgName()))
                .collect(Collectors.toList());
    }

    public Optional<Ctg_Post_DTO> getCategoryById(Long ctgId) {
        return ctgPostRepository.findById(ctgId)
                .map(ctgPost -> new Ctg_Post_DTO(ctgPost.getCtgId(), ctgPost.getCtgName()));
    }

    // UPDATE
    public Ctg_Post_DTO updateCategory(Long ctgId, Ctg_Post_DTO ctgPostDTO) {
        Ctg_Post ctgPost = ctgPostRepository.findById(ctgId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        ctgPost.setCtgName(ctgPostDTO.getCtgName());
        ctgPostRepository.save(ctgPost);
        return new Ctg_Post_DTO(ctgPost.getCtgId(), ctgPost.getCtgName());
    }

    // DELETE
    public void deleteCategory(Long ctgId) {
        ctgPostRepository.deleteById(ctgId);
    }
}

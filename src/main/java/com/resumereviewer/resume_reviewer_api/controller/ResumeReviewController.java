package com.resumereviewer.resume_reviewer_api.controller;

import com.resumereviewer.resume_reviewer_api.dto.ReviewRequest;
import com.resumereviewer.resume_reviewer_api.dto.ReviewResponse;
import com.resumereviewer.resume_reviewer_api.entity.ResumeReview;
import com.resumereviewer.resume_reviewer_api.exception.ResourceNotFoundException;
import com.resumereviewer.resume_reviewer_api.repository.ResumeReviewRepository;
import com.resumereviewer.resume_reviewer_api.service.AiAnalysisService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ResumeReviewController {

    private final ResumeReviewRepository repository;
    private final AiAnalysisService aiAnalysisService;

    @PostMapping("/analyze")
    public ResponseEntity<ReviewResponse> analyzeResume(@Valid @RequestBody ReviewRequest request) {
        String aiResponse = aiAnalysisService.analyzeResume(request.getJobDescription(), request.getResumeText());
        int matchPercentage = extractMatchPercentage(aiResponse);

        ResumeReview review = ResumeReview.builder()
                .jobDescription(request.getJobDescription())
                .resumeText(request.getResumeText())
                .matchPercentage(matchPercentage)
                .feedback(aiResponse)
                .build();

        ResumeReview saved = repository.save(review);

        ReviewResponse response = ReviewResponse.builder()
                .id(saved.getId())
                .jobDescription(saved.getJobDescription())
                .resumeText(saved.getResumeText())
                .matchPercentage(saved.getMatchPercentage())
                .feedback(saved.getFeedback())
                .createdAt(saved.getCreatedAt())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<ResumeReview>> getAllReviews() {
        return ResponseEntity.ok(repository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeReview> getReviewById(@PathVariable Long id) {
        ResumeReview review = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Análisis no encontrado con id: " + id));
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("No se puede eliminar, ID no encontrado: " + id);
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private int extractMatchPercentage(String aiResponse) {
        try {
            if (aiResponse.contains("PUNTUACION:")) {
                String scoreStr = aiResponse.split("PUNTUACION:")[1].split("\n")[0].trim();
                return Integer.parseInt(scoreStr.replaceAll("[^0-9]", ""));
            }
        } catch (Exception ignored) {}
        return 50;
    }
}
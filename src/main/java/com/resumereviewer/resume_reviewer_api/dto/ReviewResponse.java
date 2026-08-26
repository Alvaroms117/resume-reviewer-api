package com.resumereviewer.resume_reviewer_api.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {

    private Long id;
    private String jobDescription;
    private String resumeText;
    private Integer matchPercentage;
    private String feedback;
    private LocalDateTime createdAt;
}
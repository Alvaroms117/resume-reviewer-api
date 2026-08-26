package com.resumereviewer.resume_reviewer_api.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewRequest {

    @NotBlank(message = "La descripción de la oferta no puede estar vacía")
    private String jobDescription;

    @NotBlank(message = "El texto del currículum no puede estar vacío")
    private String resumeText;
}
package com.resumereviewer.resume_reviewer_api.repository;

import com.resumereviewer.resume_reviewer_api.entity.ResumeReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResumeReviewRepository extends JpaRepository<ResumeReview, Long> {
}
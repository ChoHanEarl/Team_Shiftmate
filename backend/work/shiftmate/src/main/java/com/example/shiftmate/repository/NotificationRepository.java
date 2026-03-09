package com.example.shiftmate.repository;

import com.example.shiftmate.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {
    List<NotificationEntity> findByUser_UserNumberOrderByCreatedAtDesc(Long userNumber);
    long countByUser_UserNumberAndIsReadFalse(Long userNumber);
}

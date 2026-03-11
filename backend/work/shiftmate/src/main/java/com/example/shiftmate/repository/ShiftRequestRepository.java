package com.example.shiftmate.repository;

import com.example.shiftmate.entity.ShiftRequestEntity;
import com.example.shiftmate.entity.StoreEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftRequestRepository extends JpaRepository<ShiftRequestEntity, Long> {
    List<ShiftRequestEntity> findByShift_ShiftNumber(Long shiftNumber);
    List<ShiftRequestEntity> findByUser_UserNumber(Long userNumber);
    List<ShiftRequestEntity> findByShift_Store_StoreNumber(Long storeNumber);
    List<ShiftRequestEntity> findByShift_ShiftNumberAndStatus(Long shiftNumber, String status);
    Optional<ShiftRequestEntity> findByRequestNumberAndUser_UserNumber(Long requestNumber, Long userNumber);
    boolean existsByShift_ShiftNumberAndUser_UserNumber(Long shiftNumber, Long userNumber);
    void deleteByShift_Store(StoreEntity store);
    void deleteByUser_UserNumber(Long userNumber);
}

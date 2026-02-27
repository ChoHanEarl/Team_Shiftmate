package com.example.shiftmate.repository;

import com.example.shiftmate.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByUserId(String userId);
    boolean existsByUserId(String userId);

    // ユーザータイプ（権限）による検索
    List<UserEntity> findByUserType(String userType);

    // 名前による検索（部分一致）
    List<UserEntity> findByNameContaining(String keyword);
    // ユーザーIDによる検索（部分一致）
    List<UserEntity> findByUserIdContaining(String keyword);
}
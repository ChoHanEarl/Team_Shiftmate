package com.example.shiftmate.service;

import com.example.shiftmate.dto.StoreDTO;
import com.example.shiftmate.entity.StoreEmployeeEntity;
import com.example.shiftmate.entity.StoreEntity;
import com.example.shiftmate.entity.UserEntity;
import com.example.shiftmate.exception.ShiftMateException;
import com.example.shiftmate.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class StoreService {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;
    private final ShiftRepository shiftRepository;
    private final ShiftRequestRepository shiftRequestRepository;
    private final StoreEmployeeRepository storeEmployeeRepository;
    private final NotificationService notificationService;

    // --- 店舗登録 ---
    public StoreDTO registerStore(StoreDTO storeDTO) {
        try {
            Optional<UserEntity> userOptional = userRepository.findById(storeDTO.getOwnerUserNumber());
            if (!userOptional.isPresent()) {
                throw new ShiftMateException("ユーザーが見つかりません。");
            }

            UserEntity user = userOptional.get();
            if (!"店長".equals(user.getUserType())) {
                throw new ShiftMateException("店員は店舗登録が不可能です。");
            }

            StoreEntity storeEntity = StoreEntity.builder()
                    .storeName(storeDTO.getStoreName())
                    .storeAddress(storeDTO.getStoreAddress())
                    .category(storeDTO.getCategory())
                    .owner(user)
                    .autoApprove(storeDTO.getAutoApprove() != null ? storeDTO.getAutoApprove() : false)
                    .build();

            StoreEntity savedStore = storeRepository.save(storeEntity);
            return convertToDTO(savedStore);
        } catch (ShiftMateException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ShiftMateException("店舗登録中にエラーが発生しました。", e);
        }
    }

    // --- 店長の管理店舗リスト照会 ---
    public List<StoreDTO> getOwnerStores(Long ownerUserNumber) {
        try {
            List<StoreEntity> stores = storeRepository.findByOwner_UserNumber(ownerUserNumber);
            return stores.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("店舗リストの取得中にエラーが発生しました。", e);
        }
    }

    // --- 全店舗リスト照会 ---
    public List<StoreDTO> getAllStores() {
        try {
            List<StoreEntity> stores = storeRepository.findAll();
            return stores.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("店舗リストの照会中にエラーが発生しました。", e);
        }
    }

    // --- 店舗番号による照会 ---
    public StoreDTO getStoreByNumber(Long storeNumber) {
        try {
            StoreEntity store = storeRepository.findById(storeNumber)
                    .orElseThrow(() -> new ShiftMateException("店舗が見つかりません。"));
            return convertToDTO(store);
        } catch (ShiftMateException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ShiftMateException("店舗情報の取得中にエラーが発生しました。", e);
        }
    }

    // --- 店舗情報更新 ---
    public StoreDTO updateStore(Long storeNumber, StoreDTO storeDTO, Long ownerUserNumber) {
        try {
            StoreEntity storeEntity = storeRepository.findById(storeNumber)
                    .orElseThrow(() -> new ShiftMateException("店舗が見つかりません。"));

            if (!storeEntity.getOwner().getUserNumber().equals(ownerUserNumber)) {
                throw new ShiftMateException("店舗情報を修正する権限がありません。");
            }

            StoreEntity updatedStore = StoreEntity.builder()
                    .storeNumber(storeEntity.getStoreNumber())
                    .storeName(storeDTO.getStoreName())
                    .storeAddress(storeDTO.getStoreAddress())
                    .category(storeDTO.getCategory())
                    .owner(storeEntity.getOwner())
                    .createdAt(storeEntity.getCreatedAt())
                    .autoApprove(storeDTO.getAutoApprove() != null ? storeDTO.getAutoApprove() : storeEntity.getAutoApprove())
                    .build();

            return convertToDTO(storeRepository.save(updatedStore));
        } catch (ShiftMateException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ShiftMateException("店舗情報の修正中にエラーが発生しました。", e);
        }
    }

    // --- 店舗削除 (物理削除) ---
    public void deleteStore(Long storeNumber, Long ownerUserNumber) {
        StoreEntity storeEntity = storeRepository.findById(storeNumber)
                .orElseThrow(() -> new ShiftMateException("店舗が見つかりません。"));

        if (!storeEntity.getOwner().getUserNumber().equals(ownerUserNumber)) {
            throw new ShiftMateException("店舗を削除する権限がありません。");
        }

        try {
            List<StoreEmployeeEntity> employees = storeEmployeeRepository
                    .findByStore_StoreNumberAndStatusAndIsRetiredFalse(storeNumber, "承認");
            for (StoreEmployeeEntity emp : employees) {
                notificationService.createNotification(
                        emp.getUser().getUserNumber(),
                        storeEntity.getStoreName() + "が閉店しました。",
                        "STORE_CLOSED",
                        storeNumber
                );
            }
            // 制約違反を防ぐため、関連データ（子レコード）から順に削除
            shiftRequestRepository.deleteByShift_Store(storeEntity);
            shiftRepository.deleteByStore(storeEntity);
            storeEmployeeRepository.deleteByStore(storeEntity);
            storeRepository.delete(storeEntity);

            // 最後に親レコード（店舗）を削除
            storeRepository.delete(storeEntity);
        } catch (Exception e) {
            e.printStackTrace();
            throw new ShiftMateException("データ制약条件により削除に失敗しました。");
        }
    }

    // --- Entity -> DTO 変換 ---
    private StoreDTO convertToDTO(StoreEntity entity) {
        return StoreDTO.builder()
                .storeNumber(entity.getStoreNumber())
                .storeName(entity.getStoreName())
                .storeAddress(entity.getStoreAddress())
                .category(entity.getCategory())
                .ownerUserNumber(entity.getOwner().getUserNumber())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .autoApprove(entity.getAutoApprove())
                .build();
    }
}
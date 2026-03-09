package com.example.shiftmate.service;

import com.example.shiftmate.dto.NotificationDTO;
import com.example.shiftmate.entity.NotificationEntity;
import com.example.shiftmate.entity.UserEntity;
import com.example.shiftmate.exception.ShiftMateException;
import com.example.shiftmate.repository.NotificationRepository;
import com.example.shiftmate.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public void createNotification(Long userNumber, String message, String notificationType, Long relatedId) {
        Optional<UserEntity> userOptional = userRepository.findById(userNumber);
        if (!userOptional.isPresent()) return;

        NotificationEntity notification = NotificationEntity.builder()
                .user(userOptional.get())
                .message(message)
                .notificationType(notificationType)
                .isRead(false)
                .relatedId(relatedId)
                .build();
        notificationRepository.save(notification);
    }

    public List<NotificationDTO> getMyNotifications(Long userNumber) {
        try {
            List<NotificationEntity> notifications =
                    notificationRepository.findByUser_UserNumberOrderByCreatedAtDesc(userNumber);
            return notifications.stream()
                    .map(this::convertToDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new ShiftMateException("通知リストの照会中にエラーが発生しました。", e);
        }
    }

    public long getUnreadCount(Long userNumber) {
        return notificationRepository.countByUser_UserNumberAndIsReadFalse(userNumber);
    }

    public void markAsRead(Long notificationNumber, Long userNumber) {
        Optional<NotificationEntity> optional = notificationRepository.findById(notificationNumber);
        if (!optional.isPresent()) throw new ShiftMateException("通知が見つかりません。");

        NotificationEntity notification = optional.get();
        if (!notification.getUser().getUserNumber().equals(userNumber)) {
            throw new ShiftMateException("本人の通知のみ既読処理できます。");
        }
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(Long userNumber) {
        List<NotificationEntity> unread =
                notificationRepository.findByUser_UserNumberOrderByCreatedAtDesc(userNumber)
                        .stream()
                        .filter(n -> !Boolean.TRUE.equals(n.getIsRead()))
                        .collect(Collectors.toList());
        unread.forEach(n -> n.setIsRead(true));
        notificationRepository.saveAll(unread);
    }

    public void deleteReadNotifications(Long userNumber) {
        List<NotificationEntity> readList =
                notificationRepository.findByUser_UserNumberOrderByCreatedAtDesc(userNumber)
                        .stream()
                        .filter(n -> Boolean.TRUE.equals(n.getIsRead()))
                        .collect(Collectors.toList());
        notificationRepository.deleteAll(readList);
    }

    private NotificationDTO convertToDTO(NotificationEntity entity) {
        return NotificationDTO.builder()
                .notificationNumber(entity.getNotificationNumber())
                .userNumber(entity.getUser().getUserNumber())
                .message(entity.getMessage())
                .notificationType(entity.getNotificationType())
                .isRead(entity.getIsRead())
                .relatedId(entity.getRelatedId())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}

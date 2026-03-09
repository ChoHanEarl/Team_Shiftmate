package com.example.shiftmate.controller;

import com.example.shiftmate.dto.NotificationDTO;
import com.example.shiftmate.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3030")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getMyNotifications(HttpServletRequest request) {
        Long userNumber = (Long) request.getAttribute("userNumber");
        List<NotificationDTO> notifications = notificationService.getMyNotifications(userNumber);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("notifications", notifications);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(HttpServletRequest request) {
        Long userNumber = (Long) request.getAttribute("userNumber");
        long count = notificationService.getUnreadCount(userNumber);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{notificationNumber}/read")
    public ResponseEntity<Map<String, Object>> markAsRead(
            @PathVariable Long notificationNumber,
            HttpServletRequest request) {
        Long userNumber = (Long) request.getAttribute("userNumber");
        notificationService.markAsRead(notificationNumber, userNumber);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/read-all")
    public ResponseEntity<Map<String, Object>> markAllAsRead(HttpServletRequest request) {
        Long userNumber = (Long) request.getAttribute("userNumber");
        notificationService.markAllAsRead(userNumber);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/read")
    public ResponseEntity<Map<String, Object>> deleteReadNotifications(HttpServletRequest request) {
        Long userNumber = (Long) request.getAttribute("userNumber");
        notificationService.deleteReadNotifications(userNumber);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "既読通知を削除しました。");
        return ResponseEntity.ok(response);
    }
}

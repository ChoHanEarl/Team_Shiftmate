package com.example.shiftmate.controller;

import com.example.shiftmate.dto.LoginDTO;
import com.example.shiftmate.dto.UserDTO;
import com.example.shiftmate.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3030")
public class UserController {

    private final UserService userService;
    private final com.example.shiftmate.util.JwtUtil jwtUtil;
    // ユーザーID重複確認
    @GetMapping("/check-duplicate")
    public ResponseEntity<Map<String, Object>> checkDuplicate(@RequestParam String userId ) {
        Map<String, Object> response = new HashMap<>();
        boolean isDuplicate = userService.checkUserIdDuplicate(userId);
        response.put("success", true);
        response.put("isDuplicate", isDuplicate);
        return ResponseEntity.ok(response);
    }

    //　会員登録
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@Valid @RequestBody UserDTO userDTO) {
        Map<String, Object> response = new HashMap<>();
        UserDTO registeredUser = userService.registerUser(userDTO);
        response.put("success", true);
        response.put("message", "会員登録完了！");
        response.put("user", registeredUser);
        return ResponseEntity.ok(response);
    }


    //　ログイン
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginDTO loginDTO) {
        Map<String, Object> loginResult = userService.login(loginDTO);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "ログイン成功！");
        response.put("token", loginResult.get("token"));
        response.put("user", loginResult.get("user"));
        return ResponseEntity.ok(response);
    }

    // 특정 회원 조회 API
    @GetMapping("/{userNumber}")
    public ResponseEntity<Map<String, Object>> getUserInfo(@PathVariable Long userNumber) {
        UserDTO user = userService.getUserInfo(userNumber);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", user);
        return ResponseEntity.ok(response);
    }

    // 1. 이름 단일 수정 API
    @PatchMapping("/{userNumber}/name")
    public ResponseEntity<Map<String, Object>> updateName(
            @PathVariable Long userNumber,
            @RequestBody Map<String, String> request,
            HttpServletRequest httpServletRequest) {

        // 1. 헤더에서 토큰 추출 (Bearer 제외)
        String authHeader = httpServletRequest.getHeader("Authorization");
        String token = authHeader.substring(7);

        // 2. JwtUtil을 사용해 토큰에서 아이디 추출
        String currentUserId = jwtUtil.getUserIdFromToken(token);

        UserDTO updatedUser = userService.updateName(userNumber, request.get("name"), currentUserId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", updatedUser);
        return ResponseEntity.ok(response);
    }

    // 2. 전화번호 단일 수정 API
    @PatchMapping("/{userNumber}/phone")
    public ResponseEntity<Map<String, Object>> updatePhoneNumber(
            @PathVariable Long userNumber,
            @RequestBody Map<String, String> request,
            HttpServletRequest httpServletRequest) {

        // 헤더에서 토큰 추출 및 아이디 가져오기
        String authHeader = httpServletRequest.getHeader("Authorization");
        String token = authHeader.substring(7);
        String currentUserId = jwtUtil.getUserIdFromToken(token); // 본인의 JwtUtil 메서드명 확인!

        UserDTO updatedUser = userService.updatePhoneNumber(userNumber, request.get("phoneNumber"), currentUserId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "電話番号の修正が完了しました。");
        response.put("user", updatedUser);
        return ResponseEntity.ok(response);
    }

    // 3. 비밀번호 수정 API
    @PatchMapping("/{userNumber}/password")
    public ResponseEntity<Map<String, Object>> updatePassword(
            @PathVariable Long userNumber,
            @Valid @RequestBody com.example.shiftmate.dto.ChangePasswordDTO passwordDTO,
            HttpServletRequest httpServletRequest) {

        String authHeader = httpServletRequest.getHeader("Authorization");
        String token = authHeader.substring(7);
        String currentUserId = jwtUtil.getUserIdFromToken(token);

        userService.updatePassword(userNumber, passwordDTO, currentUserId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "パスワードの変更が完了しました。");
        return ResponseEntity.ok(response);
    }

    // 회원 탈퇴 API
    @DeleteMapping("/{userNumber}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long userNumber) {
        userService.deleteUser(userNumber);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "退会処理が完了しました。");
        return ResponseEntity.ok(response);
    }



    //유저 타입별 조회
    // 테스트 주소 http://localhost:8080/api/users/type?type=店長
    @GetMapping("/type")
    public ResponseEntity<List<UserDTO>> goUsersByType(@RequestParam String type) {
        return ResponseEntity.ok(userService.getUsersType(type));
    }
    // 유저 이름 조회
    // 테스트 주소 http://localhost:8080/api/users/search?keyword=田中
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam String keyword) {
        return ResponseEntity.ok(userService.searchUsers(keyword));
    }
    //유저 아이디 조회
    // 테스트 주소 http://localhost:8080/api/users/search/id?keyword=user
    @GetMapping("/search/id")
    public ResponseEntity<List<UserDTO>> searchUsersById(@RequestParam String keyword) {
        return ResponseEntity.ok(userService.searchUsersById(keyword));
    }

}
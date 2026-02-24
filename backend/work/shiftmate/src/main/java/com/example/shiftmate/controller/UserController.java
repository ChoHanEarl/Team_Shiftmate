package com.example.shiftmate.controller;

import com.example.shiftmate.dto.LoginDTO;
import com.example.shiftmate.dto.UserDTO;
import com.example.shiftmate.service.UserService;
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

    // 회원 정보 수정 API
    @PutMapping("/{userNumber}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Long userNumber,
            @RequestBody UserDTO userDTO
    ) {
        UserDTO updatedUser = userService.updateUser(userNumber, userDTO);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "会員情報の修正が完了しました。");
        response.put("user", updatedUser);
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
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

    // 1. 名前の個別変更API
    @PatchMapping("/{userNumber}/name")
    public ResponseEntity<Map<String, Object>> updateName(
            @PathVariable Long userNumber,
            @RequestBody Map<String, String> request,
            HttpServletRequest httpServletRequest) {

        // 1. ヘッダーからトークンを抽出
        String authHeader = httpServletRequest.getHeader("Authorization");
        String token = authHeader.substring(7);

        // 2. JwtUtilを使用してトークンからユーザーIDを抽出
        String currentUserId = jwtUtil.getUserIdFromToken(token);

        UserDTO updatedUser = userService.updateName(userNumber, request.get("name"), currentUserId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", updatedUser);
        return ResponseEntity.ok(response);
    }

    // 2. 電話番号の個別変更API
    @PatchMapping("/{userNumber}/phone")
    public ResponseEntity<Map<String, Object>> updatePhoneNumber(
            @PathVariable Long userNumber,
            @RequestBody Map<String, String> request,
            HttpServletRequest httpServletRequest) {

        // ヘッダーからトークンを抽出し、ユーザーIDを取得する
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

    // 3. パスワード変更API
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

    // ユーザー退会（削除）API
    @DeleteMapping("/{userNumber}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long userNumber) {
        userService.deleteUser(userNumber);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "退会処理が完了しました。");
        return ResponseEntity.ok(response);
    }

    // ユーザータイプ（権限）別の検索
    // テスト用URL: http://localhost:8080/api/users/type?type=店長
    @GetMapping("/type")
    public ResponseEntity<List<UserDTO>> goUsersByType(@RequestParam String type) {
        return ResponseEntity.ok(userService.getUsersType(type));
    }
    // ユーザー名での検索
    // テスト用URL: http://localhost:8080/api/users/search?keyword=田中
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(@RequestParam String keyword) {
        return ResponseEntity.ok(userService.searchUsers(keyword));
    }
    // ユーザーIDでの検索 (유저 아이디 조회)
    // テスト用URL: http://localhost:8080/api/users/search/id?keyword=user
    @GetMapping("/search/id")
    public ResponseEntity<List<UserDTO>> searchUsersById(@RequestParam String keyword) {
        return ResponseEntity.ok(userService.searchUsersById(keyword));
    }

    // 特定ユーザーの詳細情報取得API
    @GetMapping("/{userNumber}")
    public ResponseEntity<Map<String, Object>> getUserInfo(
            @PathVariable Long userNumber,
            @RequestAttribute("userId") String currentUserId
    ) {
        UserDTO userInfo = userService.getUserByNumber(userNumber, currentUserId);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", userInfo);

        return ResponseEntity.ok(response);
    }
}
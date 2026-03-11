//UserService
package com.example.shiftmate.service;

import com.example.shiftmate.dto.LoginDTO;
import com.example.shiftmate.dto.UserDTO;
import com.example.shiftmate.entity.UserEntity;
import com.example.shiftmate.exception.ShiftMateException;
import com.example.shiftmate.repository.NotificationRepository;
import com.example.shiftmate.repository.ShiftRequestRepository;
import com.example.shiftmate.repository.StoreEmployeeRepository;
import com.example.shiftmate.repository.UserRepository;
import com.example.shiftmate.util.JwtUtil;
import com.example.shiftmate.util.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordUtil passwordUtil;
    private final JwtUtil jwtUtil;
    private final ShiftRequestRepository shiftRequestRepository;
    private final StoreEmployeeRepository storeEmployeeRepository;
    private final NotificationRepository notificationRepository;

    public boolean checkUserIdDuplicate(String userId) {
        try {
            return userRepository.existsByUserId(userId);
        } catch (Exception e){
            e.printStackTrace();
            throw new ShiftMateException("ユーザーID重複チェック中エラー発生",e);
        }
    }

    public UserDTO registerUser(UserDTO userDTO) {
        try {

            if (checkUserIdDuplicate(userDTO.getUserId())){
                throw new ShiftMateException("既に使用中のIDです。");
            }
            if (!passwordUtil.validatePassword(userDTO.getPassword())){
                throw new ShiftMateException("パスワードは８文字以上で、英字数字を含める必要があります。");
            }
            String hashedPassword = passwordUtil.hashPassword(userDTO.getPassword());

            if (!"店長".equals(userDTO.getUserType()) && !"従業員".equals(userDTO.getUserType())) {
                throw new ShiftMateException("ユーザータイプは「店長」または「従業員」のみ可能です");
            }

            UserEntity userEntity = UserEntity.builder()
                    .userId(userDTO.getUserId())
                    .password(hashedPassword)
                    .name(userDTO.getName())
                    .userType(userDTO.getUserType())
                    .phoneNumber(userDTO.getPhoneNumber()) // 추가됨
                    .email(userDTO.getEmail())             // 추가됨
                    .birthDate(userDTO.getBirthDate())       // 추가됨
                    .build();

            UserEntity savedUser = userRepository.save(userEntity);


            return convertToDTO(savedUser);
        } catch (ShiftMateException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ShiftMateException("会員登録中エラー発生", e);
        }
    }

    // ログイン（JWTトークン発行）
    public Map<String, Object> login(LoginDTO loginDTO) {
        try {
            Optional<UserEntity> userOptional = userRepository.findByUserId(loginDTO.getUserId());

            if (!userOptional.isPresent()) {
                throw new ShiftMateException("ユーザーIDまたはパスワードが正しくありません。");
            }

            UserEntity user = userOptional.get();

            String hashedPassword = passwordUtil.hashPassword(loginDTO.getPassword());
            if(!user.getPassword().equals(hashedPassword)){
                throw new ShiftMateException("ユーザーIDまたはパスワードが正しくありません。");
            }

            // JWT Token 生成
            String token = jwtUtil.generateToken(
                    user.getUserNumber(),
                    user.getUserId(),
                    user.getUserType()
            );

            //　応答データ
            Map<String, Object> result = new HashMap<>();
            result.put("token",token);
            result.put("user",convertToDTO(user));

            return result;
        } catch (ShiftMateException e) {
            throw e;
        } catch (Exception e) {
            e.printStackTrace();
            throw new ShiftMateException("ログイン中エラー発生", e);
        }
    }

    private UserDTO convertToDTO(UserEntity entity) {
        return UserDTO.builder()
                .userNumber(entity.getUserNumber())
                .userId(entity.getUserId())
                .name(entity.getName())
                .userType(entity.getUserType())
                .phoneNumber(entity.getPhoneNumber()) // 추가됨
                .email(entity.getEmail())             // 추가됨
                .birthDate(entity.getBirthDate())       // 추가됨
                .build();
    }


    // 1. 名前の個別変更
    @Transactional
    public UserDTO updateName(Long userNumber, String newName, String currentUserId) {

        // 空白チェック
        if (newName == null || newName.trim().isEmpty()) {
            throw new ShiftMateException("名前は空欄にできません。");
        }

        UserEntity user = userRepository.findById(userNumber)
                .orElseThrow(() -> new ShiftMateException("ユーザーが見つかりません。"));

        // 本人確認
        if (!user.getUserId().equals(currentUserId)) {
            throw new ShiftMateException("本人の情報のみ修正できます。");
        }

        user.setName(newName);
        return convertToDTO(user);
    }

    // 2. 電話番号の変更
    @Transactional
    public UserDTO updatePhoneNumber(Long userNumber, String newPhoneNumber, String currentUserId) {
        UserEntity user = userRepository.findById(userNumber)
                .orElseThrow(() -> new ShiftMateException("ユーザーが見つかりません。"));

        // 本人確認
        if (!user.getUserId().equals(currentUserId)) {
            throw new ShiftMateException("本人の情報のみ修正できます。");
        }

        user.setPhoneNumber(newPhoneNumber);
        return convertToDTO(user);
    }

    // 3. パスワードの変更
    @Transactional
    public void updatePassword(Long userNumber, com.example.shiftmate.dto.ChangePasswordDTO passwordDTO, String currentUserId) {
        UserEntity user = userRepository.findById(userNumber)
                .orElseThrow(() -> new ShiftMateException("ユーザーが見つかりません。"));

        // 本人確認
        if (!user.getUserId().equals(currentUserId)) {
            throw new ShiftMateException("本人のパスワードのみ変更できます。");
        }

        // 現在のパスワードが一致するか検証
        String hashedInputPassword = passwordUtil.hashPassword(passwordDTO.getCurrentPassword());

        if (!hashedInputPassword.equals(user.getPassword())) {
            throw new ShiftMateException("現在のパスワードが一致しません。");
        }

        if (passwordDTO.getCurrentPassword().equals(passwordDTO.getNewPassword())) {
            throw new ShiftMateException("新しいパスワードは現在のパスワードと異なるものを入力してください。");
        }

        // 新しいパスワードを暗号化して保存
        user.setPassword(passwordUtil.hashPassword(passwordDTO.getNewPassword()));
    }

    // ユーザー退会・削除
    @Transactional
    public void deleteUser(Long userNumber) {
        if (!userRepository.existsById(userNumber)) {
            throw new ShiftMateException("ユーザーが見つかりません。");
        }

        shiftRequestRepository.deleteByUser_UserNumber(userNumber);
        storeEmployeeRepository.deleteByUser_UserNumber(userNumber);
        notificationRepository.deleteByUser_UserNumber(userNumber);

        userRepository.deleteById(userNumber);
    }

    // 権限（タイプ）別のユーザー一覧取得
    public List<UserDTO> getUsersType(String type) {
        List<UserEntity> users = userRepository.findByUserType(type);

        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ユーザー名による検索（部分一致）
    public List<UserDTO> searchUsers(String keyword) {
        List<UserEntity> users = userRepository.findByNameContaining(keyword);

        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    // ユーザーIDによる検索（部分一致）
    public List<UserDTO> searchUsersById(String keyword) {
        List<UserEntity> users = userRepository.findByUserIdContaining(keyword);

        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 特定ユーザーの詳細情報取得
    @Transactional(readOnly = true)
    public UserDTO getUserByNumber(Long userNumber, String currentUserId) {

        UserEntity targetUser = userRepository.findById(userNumber)
                .orElseThrow(() -> new ShiftMateException("ユーザーが見つかりません。"));

        UserEntity currentUser = userRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ShiftMateException("ユーザーが見つかりません。"));

        boolean isManager = "店長".equals(currentUser.getUserType());
        boolean isSelf = targetUser.getUserId().equals(currentUserId);

        if (!isManager && !isSelf) {
            throw new ShiftMateException("本人の情報または店長のみ照会可能です。");
        }

        return convertToDTO(targetUser);
    }
}
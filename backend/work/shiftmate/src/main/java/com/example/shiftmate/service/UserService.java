package com.example.shiftmate.service;

import com.example.shiftmate.dto.LoginDTO;
import com.example.shiftmate.dto.UserDTO;
import com.example.shiftmate.entity.UserEntity;
import com.example.shiftmate.exception.ShiftMateException;
import com.example.shiftmate.repository.UserRepository;
import com.example.shiftmate.util.JwtUtil;
import com.example.shiftmate.util.PasswordUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    // 로그인 (JWT 토큰 변환)
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

    // 특정 회원 상세 조회
    public UserDTO getUserInfo(Long userNumber) {
        UserEntity user = userRepository.findById(userNumber)
                .orElseThrow(() -> new ShiftMateException("ユーザーが見つかりません。"));

        return convertToDTO(user);
    }

    // 1. 이름 단일 수정
    @Transactional
    public UserDTO updateName(Long userNumber, String newName, String currentUserId) {

        // 공백방지
        if (newName == null || newName.trim().isEmpty()) {
            throw new ShiftMateException("名前は空欄にできません。");
        }

        UserEntity user = userRepository.findById(userNumber)
                .orElseThrow(() -> new ShiftMateException("ユーザーが見つかりません。"));

        // 본인확인
        if (!user.getUserId().equals(currentUserId)) {
            throw new ShiftMateException("本人の情報のみ修正できます。");
        }

        user.setName(newName);
        return convertToDTO(user);
    }

    // 2. 전화번호 수정
    @Transactional
    public UserDTO updatePhoneNumber(Long userNumber, String newPhoneNumber, String currentUserId) {
        UserEntity user = userRepository.findById(userNumber)
                .orElseThrow(() -> new ShiftMateException("ユーザーが見つかりません。"));

        // 본인 확인
        if (!user.getUserId().equals(currentUserId)) {
            throw new ShiftMateException("本人の情報のみ修正できます。");
        }

        user.setPhoneNumber(newPhoneNumber);
        return convertToDTO(user);
    }

    // 3. 비밀번호 수정
    @Transactional
    public void updatePassword(Long userNumber, com.example.shiftmate.dto.ChangePasswordDTO passwordDTO, String currentUserId) {
        UserEntity user = userRepository.findById(userNumber)
                .orElseThrow(() -> new ShiftMateException("ユーザーが見つかりません。"));

        // 본인 확인
        if (!user.getUserId().equals(currentUserId)) {
            throw new ShiftMateException("本人のパスワードのみ変更できます。");
        }

        // 현재 비밀번호가 맞는지 검증
        String hashedInputPassword = passwordUtil.hashPassword(passwordDTO.getCurrentPassword());

        if (!hashedInputPassword.equals(user.getPassword())) {
            throw new ShiftMateException("現在のパスワードが一致しません。");
        }

        // 새 비밀번호 암호화 후 저장
        user.setPassword(passwordUtil.hashPassword(passwordDTO.getNewPassword()));
    }

    // 회원 탈퇴/삭제
    @Transactional
    public void deleteUser(Long userNumber) {
        if (!userRepository.existsById(userNumber)) {
            throw new ShiftMateException("ユーザーが見つかりません。");
        }

        userRepository.deleteById(userNumber);
    }

    // 타입별 회원 조회
    public List<UserDTO> getUsersType(String type) {
        List<UserEntity> users = userRepository.findByUserType(type);

        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 회원검색
    public List<UserDTO> searchUsers(String keyword) {
        List<UserEntity> users = userRepository.findByNameContaining(keyword);

        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    //회원 아이디 검색
    public List<UserDTO> searchUsersById(String keyword) {
        List<UserEntity> users = userRepository.findByUserIdContaining(keyword);

        return users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}

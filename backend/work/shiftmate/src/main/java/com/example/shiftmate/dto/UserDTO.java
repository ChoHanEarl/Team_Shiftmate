package com.example.shiftmate.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {
    private Long userNumber;
    //NotBlank의 message는 GlobalExceptionHandler.java 클래스 유효성 검사 코드 추가로 사용가능
    @NotBlank(message = "ユーザーIDは必須です。")
    private String userId;
    @NotBlank(message = "パスワードは必須です。")
    private String password;
    @NotBlank(message = "名前は必須です。")
    private String name;
    @NotBlank(message = "ユーザータイプは必須です。")
    private String userType;

    @NotBlank(message = "メールアドレスは必須です。")
    @Email(message = "正しいメールアドレスの形式で入力してください。")
    private String email;

    @NotBlank(message = "電話番号は必須です。")
    @Pattern(regexp = "^[0-9-]+$", message = "電話番号は数字とハイフン(-)のみ入力可能です。")
    private String phoneNumber;

    @NotNull(message = "生年月日は必須です。")
    @Past(message = "生年月日は過去の日付である必要があります。")
    private LocalDate birthDate;
}

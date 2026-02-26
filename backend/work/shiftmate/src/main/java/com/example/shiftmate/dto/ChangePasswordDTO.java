package com.example.shiftmate.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class ChangePasswordDTO {

    @NotBlank(message = "現在のパスワードを入力してください。")
    private String currentPassword;

    @NotBlank(message = "新しいパスワードを入力してください。")
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$", message = "パスワードは８文字以上で、英字数字を含める必要があります。")
    private String newPassword;

}
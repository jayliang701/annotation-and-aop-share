package com.example.java.dto;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Data
public class SignupRequest {

    @NotBlank
    private String nickname;

    @Email
    private String email;

    private String password;

}

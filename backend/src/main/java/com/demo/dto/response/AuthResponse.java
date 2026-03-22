package com.demo.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class AuthResponse {
    private Integer id;
    private String username;
    private String email;
    private String role;
    private String token;
    private String tokenType;
    private String message;
}

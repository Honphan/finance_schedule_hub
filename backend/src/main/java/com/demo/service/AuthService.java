package com.demo.service;

import com.demo.config.JwtTokenProvider;
import com.demo.dto.request.AuthRequest;
import com.demo.dto.response.AuthResponse;
import com.demo.entity.User;
import com.demo.repository.UserRepo;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepo userRepo;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(UserRepo userRepo, JwtTokenProvider jwtTokenProvider, BCryptPasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public ResponseEntity<?> register(AuthRequest request) {
        if (userRepo.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();
        userRepo.save(user);
        return ResponseEntity.ok("User registered successfully");
    }

    public ResponseEntity<?> login(AuthRequest request) {
        Optional<User> userOpt = userRepo.findByUsername(request.getUsername());
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Không tìm thấy tài khoản này!");
        }

        User user = userOpt.get();

        boolean passwordMatched = passwordEncoder.matches(request.getPassword(), user.getPassword())
                || user.getPassword().equals(request.getPassword());

        if (!passwordMatched) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Sai mật khẩu");
        }

        String token = jwtTokenProvider.generateToken(user);

        AuthResponse response = AuthResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .token(token)
                .tokenType("Bearer")
                .message("Đăng nhập thành công!")
                .build();

        return ResponseEntity.ok(response);
    }


}
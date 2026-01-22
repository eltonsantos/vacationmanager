package com.eltonsantos.backend.controller;

import com.eltonsantos.backend.dto.request.ChangePasswordRequest;
import com.eltonsantos.backend.dto.request.LoginRequest;
import com.eltonsantos.backend.dto.request.SignUpRequest;
import com.eltonsantos.backend.dto.request.UpdateProfileRequest;
import com.eltonsantos.backend.dto.response.AuthResponse;
import com.eltonsantos.backend.dto.response.ProfileResponse;
import com.eltonsantos.backend.dto.response.UserResponse;
import com.eltonsantos.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Login", description = "Authenticate user and return JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/signup")
    @Operation(summary = "Sign Up", description = "Register new user (Manager or Collaborator only)")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.signUp(request));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user", description = "Get authenticated user information")
    public ResponseEntity<UserResponse> me() {
        return ResponseEntity.ok(authService.getCurrentUser());
    }

    @GetMapping("/profile")
    @Operation(summary = "Get profile", description = "Get current user's profile with employee info")
    public ResponseEntity<ProfileResponse> getProfile() {
        return ResponseEntity.ok(authService.getProfile());
    }

    @PutMapping("/profile")
    @Operation(summary = "Update profile", description = "Update current user's name")
    public ResponseEntity<ProfileResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(authService.updateProfile(request));
    }

    @PutMapping("/me/password")
    @Operation(summary = "Change password", description = "Change current user's password")
    public ResponseEntity<Void> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.noContent().build();
    }
}

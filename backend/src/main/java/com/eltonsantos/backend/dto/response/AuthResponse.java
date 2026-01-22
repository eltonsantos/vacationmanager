package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.enums.Role;

import java.util.UUID;

public record AuthResponse(
        String token,
        String type,
        UUID userId,
        String email,
        Role role
) {
    public AuthResponse(String token, UUID userId, String email, Role role) {
        this(token, "Bearer", userId, email, role);
    }
}

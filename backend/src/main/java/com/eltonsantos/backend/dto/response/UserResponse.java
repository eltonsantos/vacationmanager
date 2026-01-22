package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.enums.Role;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        Role role,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}

package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.Employee;
import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.enums.Role;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        Role role,
        UUID employeeId,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static UserResponse fromEntity(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                null,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }

    public static UserResponse fromEntity(User user, Employee employee) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                employee != null ? employee.getId() : null,
                user.getCreatedAt(),
                user.getUpdatedAt()
        );
    }
}

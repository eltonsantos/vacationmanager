package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.Employee;
import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.enums.Role;

import java.util.UUID;

public record ProfileResponse(
        UUID id,
        String email,
        Role role,
        String fullName
) {
    public static ProfileResponse fromEntities(User user, Employee employee) {
        return new ProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                employee != null ? employee.getFullName() : user.getEmail().split("@")[0]
        );
    }
}

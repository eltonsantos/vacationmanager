package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.Employee;

import java.time.LocalDateTime;
import java.util.UUID;

public record EmployeeResponse(
        UUID id,
        String fullName,
        String email,
        UUID managerId,
        String managerEmail,
        UUID userId,
        Boolean active,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static EmployeeResponse fromEntity(Employee employee) {
        return new EmployeeResponse(
                employee.getId(),
                employee.getFullName(),
                employee.getEmail(),
                employee.getManager() != null ? employee.getManager().getId() : null,
                employee.getManager() != null ? employee.getManager().getEmail() : null,
                employee.getUser() != null ? employee.getUser().getId() : null,
                employee.getActive(),
                employee.getCreatedAt(),
                employee.getUpdatedAt()
        );
    }
}

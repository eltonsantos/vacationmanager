package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.Employee;
import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Dados do usuário do sistema")
public record UserResponse(
        @Schema(description = "ID único do usuário", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(description = "Email do usuário", example = "joao.silva@empresa.com")
        String email,

        @Schema(description = "Papel do usuário no sistema", example = "COLLABORATOR")
        Role role,

        @Schema(description = "ID do colaborador vinculado (se existir)", example = "660e8400-e29b-41d4-a716-446655440001")
        UUID employeeId,

        @Schema(description = "Data e hora de criação do registro", example = "2026-01-15T10:30:00")
        LocalDateTime createdAt,

        @Schema(description = "Data e hora da última atualização", example = "2026-01-20T14:45:00")
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

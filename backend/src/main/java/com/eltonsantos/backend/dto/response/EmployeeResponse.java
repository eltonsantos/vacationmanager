package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.Employee;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Dados do colaborador")
public record EmployeeResponse(
        @Schema(description = "ID único do colaborador", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(description = "Nome completo do colaborador", example = "Carlos Oliveira")
        String fullName,

        @Schema(description = "Email do colaborador", example = "carlos.oliveira@empresa.com")
        String email,

        @Schema(description = "ID do gerente responsável", example = "660e8400-e29b-41d4-a716-446655440001")
        UUID managerId,

        @Schema(description = "Email do gerente responsável", example = "gerente@empresa.com")
        String managerEmail,

        @Schema(description = "ID do usuário vinculado ao colaborador", example = "770e8400-e29b-41d4-a716-446655440002")
        UUID userId,

        @Schema(description = "Indica se o colaborador está ativo", example = "true")
        Boolean active,

        @Schema(description = "Data e hora de criação do registro", example = "2026-01-15T10:30:00")
        LocalDateTime createdAt,

        @Schema(description = "Data e hora da última atualização", example = "2026-01-20T14:45:00")
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

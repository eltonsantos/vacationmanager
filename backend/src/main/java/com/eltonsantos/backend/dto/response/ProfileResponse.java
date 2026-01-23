package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.Employee;
import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Dados do perfil do usuário autenticado")
public record ProfileResponse(
        @Schema(description = "ID único do usuário", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(description = "Email do usuário", example = "joao.silva@empresa.com")
        String email,

        @Schema(description = "Papel do usuário no sistema", example = "COLLABORATOR")
        Role role,

        @Schema(description = "Nome completo do usuário/colaborador", example = "João Silva")
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

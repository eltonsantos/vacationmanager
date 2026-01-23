package com.eltonsantos.backend.dto.request;

import com.eltonsantos.backend.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.UUID;

@Data
@Schema(description = "Dados para criação de novo usuário (Admin only)")
public class CreateUserRequest {
    
    @Schema(description = "Email do usuário (deve ser único)", example = "maria.santos@empresa.com", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    private String email;
    
    @Schema(description = "Senha do usuário", example = "Senha@123", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 8)
    @NotBlank(message = "Senha é obrigatória")
    @Size(min = 8, message = "Senha deve ter pelo menos 8 caracteres")
    private String password;
    
    @Schema(description = "Papel do usuário no sistema", example = "COLLABORATOR", requiredMode = Schema.RequiredMode.REQUIRED, allowableValues = {"ADMIN", "MANAGER", "COLLABORATOR"})
    @NotNull(message = "Role é obrigatória")
    private Role role;
    
    @Schema(description = "Nome completo do usuário", example = "Maria Santos", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "Nome é obrigatório")
    private String fullName;
    
    @Schema(description = "ID do gerente responsável (obrigatório para COLLABORATOR)", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID managerId;
}

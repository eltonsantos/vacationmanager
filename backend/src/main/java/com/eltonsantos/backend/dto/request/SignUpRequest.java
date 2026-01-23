package com.eltonsantos.backend.dto.request;

import com.eltonsantos.backend.enums.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "Dados para registro de novo usuário no sistema")
public record SignUpRequest(
        @Schema(description = "Nome completo do usuário", example = "João Silva", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 2, maxLength = 255)
        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 255, message = "Full name must be between 2 and 255 characters")
        String fullName,

        @Schema(description = "Email do usuário (deve ser único)", example = "joao.silva@empresa.com", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @Schema(description = "Senha do usuário (mínimo 8 caracteres)", example = "Senha@123", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 8, maxLength = 100)
        @NotBlank(message = "Password is required")
        @Size(min = 8, max = 100, message = "Password must be between 8 and 100 characters")
        String password,

        @Schema(description = "Papel do usuário no sistema (apenas MANAGER ou COLLABORATOR permitidos no signup)", example = "COLLABORATOR", requiredMode = Schema.RequiredMode.REQUIRED, allowableValues = {"MANAGER", "COLLABORATOR"})
        @NotNull(message = "Role is required")
        Role role
) {
}

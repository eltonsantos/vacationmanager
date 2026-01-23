package com.eltonsantos.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Credenciais para autenticação do usuário")
public record LoginRequest(
        @Schema(description = "Email do usuário", example = "admin@vacation.com", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @Schema(description = "Senha do usuário", example = "Admin@123", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 8)
        @NotBlank(message = "Password is required")
        String password
) {}

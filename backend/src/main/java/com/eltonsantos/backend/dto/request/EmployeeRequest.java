package com.eltonsantos.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.UUID;

@Schema(description = "Dados para criação ou atualização de colaborador")
public record EmployeeRequest(
        @Schema(description = "Nome completo do colaborador", example = "Carlos Oliveira", requiredMode = Schema.RequiredMode.REQUIRED, minLength = 2, maxLength = 255)
        @NotBlank(message = "Full name is required")
        @Size(min = 2, max = 255, message = "Full name must be between 2 and 255 characters")
        String fullName,

        @Schema(description = "Email do colaborador", example = "carlos.oliveira@empresa.com", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        String email,

        @Schema(description = "ID do gerente responsável pelo colaborador", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID managerId,

        @Schema(description = "ID do usuário vinculado ao colaborador", example = "660e8400-e29b-41d4-a716-446655440001")
        UUID userId
) {}

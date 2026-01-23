package com.eltonsantos.backend.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "Dados para solicitação de férias")
public record VacationRequestDto(
        @Schema(description = "ID do colaborador solicitante", example = "550e8400-e29b-41d4-a716-446655440000", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotNull(message = "Employee ID is required")
        UUID employeeId,

        @Schema(description = "Data de início das férias", example = "2026-03-01", requiredMode = Schema.RequiredMode.REQUIRED, format = "date")
        @NotNull(message = "Start date is required")
        LocalDate startDate,

        @Schema(description = "Data de término das férias", example = "2026-03-15", requiredMode = Schema.RequiredMode.REQUIRED, format = "date")
        @NotNull(message = "End date is required")
        LocalDate endDate,

        @Schema(description = "Motivo ou observações sobre a solicitação", example = "Férias de família", maxLength = 500)
        @Size(max = 500, message = "Reason must be at most 500 characters")
        String reason
) {}

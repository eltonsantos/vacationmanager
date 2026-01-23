package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.VacationBalance;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.UUID;

@Schema(description = "Saldo de férias do colaborador")
public record VacationBalanceResponse(
        @Schema(description = "ID único do registro de saldo", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(description = "ID do colaborador", example = "660e8400-e29b-41d4-a716-446655440001")
        UUID employeeId,

        @Schema(description = "Nome do colaborador", example = "Carlos Oliveira")
        String employeeName,

        @Schema(description = "Ano de referência do saldo", example = "2026")
        Integer year,

        @Schema(description = "Total de dias de férias disponíveis no ano", example = "30")
        Integer entitledDays,

        @Schema(description = "Dias de férias já utilizados", example = "10")
        Integer usedDays,

        @Schema(description = "Dias de férias restantes", example = "20")
        Integer remainingDays
) {
    public static VacationBalanceResponse fromEntity(VacationBalance balance) {
        return new VacationBalanceResponse(
                balance.getId(),
                balance.getEmployee().getId(),
                balance.getEmployee().getFullName(),
                balance.getYear(),
                balance.getEntitledDays(),
                balance.getUsedDays(),
                balance.getRemainingDays()
        );
    }
}

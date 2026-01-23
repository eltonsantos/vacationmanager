package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.VacationRequest;
import com.eltonsantos.backend.enums.VacationStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "Dados da solicitação de férias")
public record VacationResponse(
        @Schema(description = "ID único da solicitação", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(description = "ID do colaborador solicitante", example = "660e8400-e29b-41d4-a716-446655440001")
        UUID employeeId,

        @Schema(description = "Nome do colaborador solicitante", example = "Carlos Oliveira")
        String employeeName,

        @Schema(description = "Email do colaborador solicitante", example = "carlos.oliveira@empresa.com")
        String employeeEmail,

        @Schema(description = "Data de início das férias", example = "2026-03-01", format = "date")
        LocalDate startDate,

        @Schema(description = "Data de término das férias", example = "2026-03-15", format = "date")
        LocalDate endDate,

        @Schema(description = "Quantidade de dias de férias", example = "15")
        long daysCount,

        @Schema(description = "Status atual da solicitação", example = "PENDING")
        VacationStatus status,

        @Schema(description = "Data e hora da solicitação", example = "2026-01-20T09:00:00")
        LocalDateTime requestedAt,

        @Schema(description = "Data e hora da decisão (aprovação/rejeição)", example = "2026-01-22T14:30:00")
        LocalDateTime decisionAt,

        @Schema(description = "ID do usuário que tomou a decisão", example = "770e8400-e29b-41d4-a716-446655440002")
        UUID decidedByUserId,

        @Schema(description = "Email do usuário que tomou a decisão", example = "gerente@empresa.com")
        String decidedByEmail,

        @Schema(description = "Motivo da solicitação informado pelo colaborador", example = "Férias de família")
        String reason,

        @Schema(description = "Comentário do gestor sobre a decisão", example = "Aprovado conforme solicitado")
        String managerComment
) {
    public static VacationResponse fromEntity(VacationRequest vacation) {
        return new VacationResponse(
                vacation.getId(),
                vacation.getEmployee().getId(),
                vacation.getEmployee().getFullName(),
                vacation.getEmployee().getEmail(),
                vacation.getStartDate(),
                vacation.getEndDate(),
                vacation.getDaysCount(),
                vacation.getStatus(),
                vacation.getRequestedAt(),
                vacation.getDecisionAt(),
                vacation.getDecidedBy() != null ? vacation.getDecidedBy().getId() : null,
                vacation.getDecidedBy() != null ? vacation.getDecidedBy().getEmail() : null,
                vacation.getReason(),
                vacation.getManagerComment()
        );
    }
}

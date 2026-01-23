package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.AuditLog;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Schema(description = "Registro de log de auditoria")
public record AuditLogResponse(
        @Schema(description = "ID único do registro de auditoria", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(description = "ID do usuário que realizou a ação", example = "660e8400-e29b-41d4-a716-446655440001")
        UUID actorUserId,

        @Schema(description = "Email do usuário que realizou a ação", example = "admin@vacation.com")
        String actorEmail,

        @Schema(description = "Tipo de ação realizada", example = "VACATION_APPROVED")
        String action,

        @Schema(description = "Tipo da entidade afetada", example = "VacationRequest")
        String entityType,

        @Schema(description = "ID da entidade afetada", example = "770e8400-e29b-41d4-a716-446655440002")
        UUID entityId,

        @Schema(description = "Metadados adicionais da ação", example = "{\"previousStatus\": \"PENDING\", \"newStatus\": \"APPROVED\"}")
        Map<String, Object> metadata,

        @Schema(description = "Data e hora da ação", example = "2026-01-22T14:30:00")
        LocalDateTime createdAt
) {
    public static AuditLogResponse fromEntity(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getActor().getId(),
                log.getActor().getEmail(),
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                log.getMetadata(),
                log.getCreatedAt()
        );
    }
}

package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.AuditLog;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

public record AuditLogResponse(
        UUID id,
        UUID actorUserId,
        String actorEmail,
        String action,
        String entityType,
        UUID entityId,
        Map<String, Object> metadata,
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

package com.eltonsantos.backend.service;

import com.eltonsantos.backend.dto.response.AuditLogResponse;
import com.eltonsantos.backend.dto.response.PageResponse;
import com.eltonsantos.backend.entity.AuditLog;
import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditService {

    private final AuditLogRepository auditLogRepository;

    @Async
    @Transactional
    public void log(User actor, String action, String entityType, UUID entityId, Map<String, Object> metadata) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .actor(actor)
                    .action(action)
                    .entityType(entityType)
                    .entityId(entityId)
                    .metadata(metadata)
                    .build();
            auditLogRepository.save(auditLog);
            log.debug("Audit log created: {} - {} - {}", action, entityType, entityId);
        } catch (Exception e) {
            log.error("Failed to create audit log: {}", e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public PageResponse<AuditLogResponse> findAll(Pageable pageable) {
        Page<AuditLog> page = auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.from(page, AuditLogResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public PageResponse<AuditLogResponse> findByEntityType(String entityType, Pageable pageable) {
        Page<AuditLog> page = auditLogRepository.findByEntityType(entityType, pageable);
        return PageResponse.from(page, AuditLogResponse::fromEntity);
    }
}

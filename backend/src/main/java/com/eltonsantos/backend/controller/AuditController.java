package com.eltonsantos.backend.controller;

import com.eltonsantos.backend.dto.response.AuditLogResponse;
import com.eltonsantos.backend.dto.response.PageResponse;
import com.eltonsantos.backend.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/audit-logs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Audit Logs", description = "Audit log endpoints (Admin only)")
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "List audit logs", description = "Get paginated list of audit logs")
    public ResponseEntity<PageResponse<AuditLogResponse>> findAll(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(auditService.findAll(pageable));
    }

    @GetMapping("/entity/{entityType}")
    @Operation(summary = "List by entity type", description = "Get audit logs filtered by entity type")
    public ResponseEntity<PageResponse<AuditLogResponse>> findByEntityType(
            @PathVariable String entityType,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(auditService.findByEntityType(entityType, pageable));
    }
}

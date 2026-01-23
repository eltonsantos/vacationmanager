package com.eltonsantos.backend.controller;

import com.eltonsantos.backend.dto.response.AuditLogResponse;
import com.eltonsantos.backend.dto.response.PageResponse;
import com.eltonsantos.backend.exception.GlobalExceptionHandler.ErrorResponse;
import com.eltonsantos.backend.service.AuditService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
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
@Tag(name = "Auditoria", description = "Endpoints para consulta de logs de auditoria do sistema (exclusivo para administradores)")
public class AuditController {

    private final AuditService auditService;

    @GetMapping
    @Operation(summary = "Listar logs de auditoria", description = "Retorna lista paginada de todos os registros de auditoria do sistema, ordenados do mais recente para o mais antigo")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de logs retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Sem permissão de administrador", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<PageResponse<AuditLogResponse>> findAll(
            @Parameter(description = "Parâmetros de paginação (page, size, sort)")
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(auditService.findAll(pageable));
    }

    @GetMapping("/entity/{entityType}")
    @Operation(summary = "Listar logs por tipo de entidade", description = "Retorna logs de auditoria filtrados por tipo de entidade (ex: VacationRequest, Employee, User)")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de logs filtrada retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Sem permissão de administrador", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<PageResponse<AuditLogResponse>> findByEntityType(
            @Parameter(description = "Tipo da entidade para filtro", required = true, example = "VacationRequest", 
                schema = @Schema(allowableValues = {"VacationRequest", "Employee", "User"}))
            @PathVariable String entityType,
            @Parameter(description = "Parâmetros de paginação (page, size, sort)")
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(auditService.findByEntityType(entityType, pageable));
    }
}

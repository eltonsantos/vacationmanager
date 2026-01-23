package com.eltonsantos.backend.controller;

import com.eltonsantos.backend.dto.request.VacationDecisionRequest;
import com.eltonsantos.backend.dto.request.VacationRequestDto;
import com.eltonsantos.backend.dto.response.PageResponse;
import com.eltonsantos.backend.dto.response.VacationResponse;
import com.eltonsantos.backend.exception.GlobalExceptionHandler.ErrorResponse;
import com.eltonsantos.backend.exception.GlobalExceptionHandler.ValidationErrorResponse;
import com.eltonsantos.backend.service.VacationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/vacations")
@RequiredArgsConstructor
@Tag(name = "Férias", description = "Endpoints para gerenciamento de solicitações de férias")
public class VacationController {

    private final VacationService vacationService;

    @GetMapping
    @Operation(summary = "Listar solicitações de férias", description = "Retorna lista paginada de todas as solicitações de férias. Administradores e gerentes veem todas; colaboradores veem apenas as próprias")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de solicitações retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<PageResponse<VacationResponse>> findAll(
            @Parameter(description = "Parâmetros de paginação (page, size, sort)")
            @PageableDefault(size = 10, sort = "requestedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(vacationService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter solicitação por ID", description = "Retorna os detalhes de uma solicitação de férias específica")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Solicitação encontrada", 
            content = @Content(schema = @Schema(implementation = VacationResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Solicitação não encontrada", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<VacationResponse> findById(
            @Parameter(description = "ID da solicitação de férias", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable UUID id) {
        return ResponseEntity.ok(vacationService.findById(id));
    }

    @GetMapping("/calendar")
    @Operation(summary = "Obter férias para calendário", description = "Retorna lista de férias aprovadas em um período específico para exibição no calendário")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de férias retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<List<VacationResponse>> findForCalendar(
            @Parameter(description = "Data inicial do período", required = true, example = "2026-01-01")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "Data final do período", required = true, example = "2026-12-31")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(vacationService.findAllForCalendar(startDate, endDate));
    }

    @PostMapping
    @Operation(summary = "Criar solicitação de férias", description = "Cria uma nova solicitação de férias para um colaborador")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Solicitação criada com sucesso", 
            content = @Content(schema = @Schema(implementation = VacationResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos", 
            content = @Content(schema = @Schema(implementation = ValidationErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "409", description = "Conflito de datas com férias existentes", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<VacationResponse> create(@Valid @RequestBody VacationRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vacationService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar solicitação", description = "Atualiza uma solicitação de férias pendente. Apenas o próprio colaborador ou administrador pode atualizar")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Solicitação atualizada com sucesso", 
            content = @Content(schema = @Schema(implementation = VacationResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos ou solicitação não está pendente", 
            content = @Content(schema = @Schema(implementation = ValidationErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Sem permissão para atualizar esta solicitação", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Solicitação não encontrada", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<VacationResponse> update(
            @Parameter(description = "ID da solicitação de férias", required = true)
            @PathVariable UUID id,
            @Valid @RequestBody VacationRequestDto request) {
        return ResponseEntity.ok(vacationService.update(id, request));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancelar solicitação", description = "Cancela uma solicitação de férias. O colaborador pode cancelar suas próprias solicitações pendentes")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Solicitação cancelada com sucesso", 
            content = @Content(schema = @Schema(implementation = VacationResponse.class))),
        @ApiResponse(responseCode = "400", description = "Solicitação não pode ser cancelada (não está pendente)", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Sem permissão para cancelar esta solicitação", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Solicitação não encontrada", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<VacationResponse> cancel(
            @Parameter(description = "ID da solicitação de férias", required = true)
            @PathVariable UUID id) {
        return ResponseEntity.ok(vacationService.cancel(id));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Aprovar solicitação", description = "Aprova uma solicitação de férias pendente. Apenas administradores e gerentes podem aprovar")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Solicitação aprovada com sucesso", 
            content = @Content(schema = @Schema(implementation = VacationResponse.class))),
        @ApiResponse(responseCode = "400", description = "Solicitação não está pendente", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Sem permissão para aprovar solicitações", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Solicitação não encontrada", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<VacationResponse> approve(
            @Parameter(description = "ID da solicitação de férias", required = true)
            @PathVariable UUID id,
            @RequestBody(required = false) VacationDecisionRequest request) {
        return ResponseEntity.ok(vacationService.approve(id, request));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Rejeitar solicitação", description = "Rejeita uma solicitação de férias pendente. Apenas administradores e gerentes podem rejeitar")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Solicitação rejeitada com sucesso", 
            content = @Content(schema = @Schema(implementation = VacationResponse.class))),
        @ApiResponse(responseCode = "400", description = "Solicitação não está pendente", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Sem permissão para rejeitar solicitações", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Solicitação não encontrada", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<VacationResponse> reject(
            @Parameter(description = "ID da solicitação de férias", required = true)
            @PathVariable UUID id,
            @RequestBody(required = false) VacationDecisionRequest request) {
        return ResponseEntity.ok(vacationService.reject(id, request));
    }
}

package com.eltonsantos.backend.controller;

import com.eltonsantos.backend.dto.response.PageResponse;
import com.eltonsantos.backend.dto.response.VacationBalanceResponse;
import com.eltonsantos.backend.exception.GlobalExceptionHandler.ErrorResponse;
import com.eltonsantos.backend.service.BalanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/balances")
@RequiredArgsConstructor
@Tag(name = "Saldo de Férias", description = "Endpoints para consulta de saldo de férias dos colaboradores")
public class BalanceController {

    private final BalanceService balanceService;

    @GetMapping
    @Operation(summary = "Listar saldos de férias", description = "Retorna lista paginada de saldos de férias para um ano específico. Se não informado, usa o ano atual")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de saldos retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<PageResponse<VacationBalanceResponse>> findByYear(
            @Parameter(description = "Ano de referência para consulta do saldo (padrão: ano atual)", example = "2026")
            @RequestParam(required = false) Integer year,
            @Parameter(description = "Parâmetros de paginação (page, size)")
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(balanceService.findByYear(year, pageable));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Obter saldo de colaborador", description = "Retorna o saldo de férias de um colaborador específico para um ano")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Saldo encontrado", 
            content = @Content(schema = @Schema(implementation = VacationBalanceResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Colaborador ou saldo não encontrado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<VacationBalanceResponse> findByEmployeeAndYear(
            @Parameter(description = "ID do colaborador", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable UUID employeeId,
            @Parameter(description = "Ano de referência (padrão: ano atual)", example = "2026")
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(balanceService.findByEmployeeAndYear(employeeId, year));
    }
}

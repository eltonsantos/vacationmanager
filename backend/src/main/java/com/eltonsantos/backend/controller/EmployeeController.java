package com.eltonsantos.backend.controller;

import com.eltonsantos.backend.dto.request.EmployeeRequest;
import com.eltonsantos.backend.dto.response.EmployeeResponse;
import com.eltonsantos.backend.dto.response.PageResponse;
import com.eltonsantos.backend.exception.GlobalExceptionHandler.ErrorResponse;
import com.eltonsantos.backend.exception.GlobalExceptionHandler.ValidationErrorResponse;
import com.eltonsantos.backend.service.EmployeeService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
@Tag(name = "Colaboradores", description = "Endpoints para gerenciamento de colaboradores")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @Operation(summary = "Listar colaboradores", description = "Retorna lista paginada de todos os colaboradores ativos do sistema")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista de colaboradores retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<PageResponse<EmployeeResponse>> findAll(
            @Parameter(description = "Parâmetros de paginação (page, size, sort)")
            @PageableDefault(size = 10, sort = "fullName", direction = Sort.Direction.ASC) Pageable pageable) {
        return ResponseEntity.ok(employeeService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obter colaborador por ID", description = "Retorna os detalhes de um colaborador específico")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Colaborador encontrado", 
            content = @Content(schema = @Schema(implementation = EmployeeResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Colaborador não encontrado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<EmployeeResponse> findById(
            @Parameter(description = "ID do colaborador", required = true, example = "550e8400-e29b-41d4-a716-446655440000")
            @PathVariable UUID id) {
        return ResponseEntity.ok(employeeService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Criar colaborador", description = "Cria um novo colaborador no sistema. Requer permissão de administrador")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Colaborador criado com sucesso", 
            content = @Content(schema = @Schema(implementation = EmployeeResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos ou email já cadastrado", 
            content = @Content(schema = @Schema(implementation = ValidationErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Sem permissão de administrador", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<EmployeeResponse> create(@Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(employeeService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Atualizar colaborador", description = "Atualiza os dados de um colaborador existente. Requer permissão de administrador")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Colaborador atualizado com sucesso", 
            content = @Content(schema = @Schema(implementation = EmployeeResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos", 
            content = @Content(schema = @Schema(implementation = ValidationErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Sem permissão de administrador", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Colaborador não encontrado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<EmployeeResponse> update(
            @Parameter(description = "ID do colaborador", required = true)
            @PathVariable UUID id,
            @Valid @RequestBody EmployeeRequest request) {
        return ResponseEntity.ok(employeeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Excluir colaborador", description = "Realiza exclusão lógica (soft delete) de um colaborador. Requer permissão de administrador")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Colaborador excluído com sucesso"),
        @ApiResponse(responseCode = "401", description = "Token inválido ou expirado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "403", description = "Sem permissão de administrador", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "404", description = "Colaborador não encontrado", 
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "ID do colaborador", required = true)
            @PathVariable UUID id) {
        employeeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

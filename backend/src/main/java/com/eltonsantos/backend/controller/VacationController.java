package com.eltonsantos.backend.controller;

import com.eltonsantos.backend.dto.request.VacationDecisionRequest;
import com.eltonsantos.backend.dto.request.VacationRequestDto;
import com.eltonsantos.backend.dto.response.PageResponse;
import com.eltonsantos.backend.dto.response.VacationResponse;
import com.eltonsantos.backend.service.VacationService;
import io.swagger.v3.oas.annotations.Operation;
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
@Tag(name = "Vacations", description = "Vacation request management endpoints")
public class VacationController {

    private final VacationService vacationService;

    @GetMapping
    @Operation(summary = "List vacations", description = "Get paginated list of vacation requests")
    public ResponseEntity<PageResponse<VacationResponse>> findAll(
            @PageableDefault(size = 10, sort = "requestedAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(vacationService.findAll(pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get vacation", description = "Get vacation request by ID")
    public ResponseEntity<VacationResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(vacationService.findById(id));
    }

    @GetMapping("/calendar")
    @Operation(summary = "Get vacations for calendar", description = "Get approved vacations for calendar view")
    public ResponseEntity<List<VacationResponse>> findForCalendar(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(vacationService.findAllForCalendar(startDate, endDate));
    }

    @PostMapping
    @Operation(summary = "Create vacation request", description = "Create new vacation request")
    public ResponseEntity<VacationResponse> create(@Valid @RequestBody VacationRequestDto request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vacationService.create(request));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update vacation request", description = "Update pending vacation request")
    public ResponseEntity<VacationResponse> update(
            @PathVariable UUID id,
            @Valid @RequestBody VacationRequestDto request) {
        return ResponseEntity.ok(vacationService.update(id, request));
    }

    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel vacation request", description = "Cancel vacation request")
    public ResponseEntity<VacationResponse> cancel(@PathVariable UUID id) {
        return ResponseEntity.ok(vacationService.cancel(id));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Approve vacation request", description = "Approve pending vacation request (Admin/Manager)")
    public ResponseEntity<VacationResponse> approve(
            @PathVariable UUID id,
            @RequestBody(required = false) VacationDecisionRequest request) {
        return ResponseEntity.ok(vacationService.approve(id, request));
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    @Operation(summary = "Reject vacation request", description = "Reject pending vacation request (Admin/Manager)")
    public ResponseEntity<VacationResponse> reject(
            @PathVariable UUID id,
            @RequestBody(required = false) VacationDecisionRequest request) {
        return ResponseEntity.ok(vacationService.reject(id, request));
    }
}

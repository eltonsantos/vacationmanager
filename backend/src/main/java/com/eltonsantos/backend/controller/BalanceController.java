package com.eltonsantos.backend.controller;

import com.eltonsantos.backend.dto.response.PageResponse;
import com.eltonsantos.backend.dto.response.VacationBalanceResponse;
import com.eltonsantos.backend.service.BalanceService;
import io.swagger.v3.oas.annotations.Operation;
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
@Tag(name = "Balances", description = "Vacation balance endpoints")
public class BalanceController {

    private final BalanceService balanceService;

    @GetMapping
    @Operation(summary = "List balances", description = "Get vacation balances for year")
    public ResponseEntity<PageResponse<VacationBalanceResponse>> findByYear(
            @RequestParam(required = false) Integer year,
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(balanceService.findByYear(year, pageable));
    }

    @GetMapping("/employee/{employeeId}")
    @Operation(summary = "Get employee balance", description = "Get vacation balance for specific employee and year")
    public ResponseEntity<VacationBalanceResponse> findByEmployeeAndYear(
            @PathVariable UUID employeeId,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(balanceService.findByEmployeeAndYear(employeeId, year));
    }
}

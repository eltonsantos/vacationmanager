package com.eltonsantos.backend.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.UUID;

public record VacationRequestDto(
        @NotNull(message = "Employee ID is required")
        UUID employeeId,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        @NotNull(message = "End date is required")
        LocalDate endDate,

        @Size(max = 500, message = "Reason must be at most 500 characters")
        String reason
) {}

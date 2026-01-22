package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.VacationRequest;
import com.eltonsantos.backend.enums.VacationStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record VacationResponse(
        UUID id,
        UUID employeeId,
        String employeeName,
        String employeeEmail,
        LocalDate startDate,
        LocalDate endDate,
        long daysCount,
        VacationStatus status,
        LocalDateTime requestedAt,
        LocalDateTime decisionAt,
        UUID decidedByUserId,
        String decidedByEmail,
        String reason,
        String managerComment
) {
    public static VacationResponse fromEntity(VacationRequest vacation) {
        return new VacationResponse(
                vacation.getId(),
                vacation.getEmployee().getId(),
                vacation.getEmployee().getFullName(),
                vacation.getEmployee().getEmail(),
                vacation.getStartDate(),
                vacation.getEndDate(),
                vacation.getDaysCount(),
                vacation.getStatus(),
                vacation.getRequestedAt(),
                vacation.getDecisionAt(),
                vacation.getDecidedBy() != null ? vacation.getDecidedBy().getId() : null,
                vacation.getDecidedBy() != null ? vacation.getDecidedBy().getEmail() : null,
                vacation.getReason(),
                vacation.getManagerComment()
        );
    }
}

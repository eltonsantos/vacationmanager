package com.eltonsantos.backend.dto.response;

import com.eltonsantos.backend.entity.VacationBalance;

import java.util.UUID;

public record VacationBalanceResponse(
        UUID id,
        UUID employeeId,
        String employeeName,
        Integer year,
        Integer entitledDays,
        Integer usedDays,
        Integer remainingDays
) {
    public static VacationBalanceResponse fromEntity(VacationBalance balance) {
        return new VacationBalanceResponse(
                balance.getId(),
                balance.getEmployee().getId(),
                balance.getEmployee().getFullName(),
                balance.getYear(),
                balance.getEntitledDays(),
                balance.getUsedDays(),
                balance.getRemainingDays()
        );
    }
}

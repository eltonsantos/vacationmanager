package com.eltonsantos.backend.service;

import com.eltonsantos.backend.entity.Employee;
import com.eltonsantos.backend.entity.VacationBalance;
import com.eltonsantos.backend.repository.EmployeeRepository;
import com.eltonsantos.backend.repository.VacationBalanceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BalanceServiceTest {

    @Mock
    private VacationBalanceRepository vacationBalanceRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private AuthService authService;

    @InjectMocks
    private BalanceService balanceService;

    private Employee testEmployee;
    private VacationBalance testBalance;
    private UUID employeeId;

    @BeforeEach
    void setUp() {
        employeeId = UUID.randomUUID();
        
        testEmployee = Employee.builder()
                .id(employeeId)
                .fullName("John Doe")
                .email("john@example.com")
                .active(true)
                .build();

        testBalance = VacationBalance.builder()
                .id(UUID.randomUUID())
                .employee(testEmployee)
                .year(2026)
                .entitledDays(22)
                .usedDays(5)
                .remainingDays(17)
                .build();
    }

    @Test
    @DisplayName("Should deduct days from balance when vacation is approved")
    void should_DeductDays_When_VacationApproved() {
        when(vacationBalanceRepository.findByEmployeeIdAndYear(employeeId, 2026))
                .thenReturn(Optional.of(testBalance));
        when(vacationBalanceRepository.save(any(VacationBalance.class)))
                .thenAnswer(i -> i.getArgument(0));

        balanceService.deductDays(employeeId, 2026, 5);

        assertEquals(10, testBalance.getUsedDays());
        assertEquals(12, testBalance.getRemainingDays());
        verify(vacationBalanceRepository).save(testBalance);
    }

    @Test
    @DisplayName("Should restore days to balance when vacation is cancelled")
    void should_RestoreDays_When_VacationCancelled() {
        when(vacationBalanceRepository.findByEmployeeIdAndYear(employeeId, 2026))
                .thenReturn(Optional.of(testBalance));
        when(vacationBalanceRepository.save(any(VacationBalance.class)))
                .thenAnswer(i -> i.getArgument(0));

        balanceService.restoreDays(employeeId, 2026, 5);

        assertEquals(0, testBalance.getUsedDays());
        assertEquals(22, testBalance.getRemainingDays());
        verify(vacationBalanceRepository).save(testBalance);
    }
}

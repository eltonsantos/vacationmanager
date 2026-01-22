package com.eltonsantos.backend.service;

import com.eltonsantos.backend.dto.response.PageResponse;
import com.eltonsantos.backend.dto.response.VacationBalanceResponse;
import com.eltonsantos.backend.entity.Employee;
import com.eltonsantos.backend.entity.VacationBalance;
import com.eltonsantos.backend.enums.Role;
import com.eltonsantos.backend.exception.ResourceNotFoundException;
import com.eltonsantos.backend.repository.EmployeeRepository;
import com.eltonsantos.backend.repository.VacationBalanceRepository;
import com.eltonsantos.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BalanceService {

    private final VacationBalanceRepository vacationBalanceRepository;
    private final EmployeeRepository employeeRepository;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public PageResponse<VacationBalanceResponse> findByYear(Integer year, Pageable pageable) {
        if (year == null) {
            year = Year.now().getValue();
        }

        CustomUserDetails currentUser = authService.getCurrentUserDetails();
        List<VacationBalance> balances;

        if (currentUser.getRole() == Role.ADMIN) {
            balances = vacationBalanceRepository.findByYear(year);
        } else if (currentUser.getRole() == Role.MANAGER) {
            List<Employee> teamEmployees = employeeRepository.findByManagerId(currentUser.getId());
            List<UUID> employeeIds = teamEmployees.stream().map(Employee::getId).toList();
            balances = vacationBalanceRepository.findByYear(year).stream()
                    .filter(b -> employeeIds.contains(b.getEmployee().getId()))
                    .toList();
        } else {
            Employee employee = employeeRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found for current user"));
            balances = vacationBalanceRepository.findByEmployeeIdAndYear(employee.getId(), year)
                    .map(List::of)
                    .orElse(List.of());
        }

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), balances.size());
        List<VacationBalance> pageContent = balances.subList(start, end);

        return PageResponse.from(
                new PageImpl<>(pageContent, pageable, balances.size()),
                VacationBalanceResponse::fromEntity
        );
    }

    @Transactional(readOnly = true)
    public VacationBalanceResponse findByEmployeeAndYear(UUID employeeId, Integer year) {
        if (year == null) {
            year = Year.now().getValue();
        }

        VacationBalance balance = vacationBalanceRepository.findByEmployeeIdAndYear(employeeId, year)
                .orElseThrow(() -> new ResourceNotFoundException("Balance not found for employee and year"));

        return VacationBalanceResponse.fromEntity(balance);
    }

    @Transactional
    public VacationBalance getOrCreateBalance(UUID employeeId, Integer year) {
        return vacationBalanceRepository.findByEmployeeIdAndYear(employeeId, year)
                .orElseGet(() -> {
                    Employee employee = employeeRepository.findById(employeeId)
                            .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", employeeId));
                    
                    VacationBalance newBalance = VacationBalance.builder()
                            .employee(employee)
                            .year(year)
                            .entitledDays(22)
                            .usedDays(0)
                            .remainingDays(22)
                            .build();
                    return vacationBalanceRepository.save(newBalance);
                });
    }

    @Transactional
    public void deductDays(UUID employeeId, Integer year, int days) {
        VacationBalance balance = getOrCreateBalance(employeeId, year);
        balance.deductDays(days);
        vacationBalanceRepository.save(balance);
    }

    @Transactional
    public void restoreDays(UUID employeeId, Integer year, int days) {
        VacationBalance balance = getOrCreateBalance(employeeId, year);
        balance.restoreDays(days);
        vacationBalanceRepository.save(balance);
    }
}

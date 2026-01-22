package com.eltonsantos.backend.service;

import com.eltonsantos.backend.dto.request.VacationDecisionRequest;
import com.eltonsantos.backend.dto.request.VacationRequestDto;
import com.eltonsantos.backend.dto.response.PageResponse;
import com.eltonsantos.backend.dto.response.VacationResponse;
import com.eltonsantos.backend.entity.Employee;
import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.entity.VacationRequest;
import com.eltonsantos.backend.enums.Role;
import com.eltonsantos.backend.enums.VacationStatus;
import com.eltonsantos.backend.exception.BusinessException;
import com.eltonsantos.backend.exception.ResourceNotFoundException;
import com.eltonsantos.backend.exception.UnauthorizedException;
import com.eltonsantos.backend.exception.VacationOverlapException;
import com.eltonsantos.backend.repository.EmployeeRepository;
import com.eltonsantos.backend.repository.VacationRequestRepository;
import com.eltonsantos.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class VacationService {

    private final VacationRequestRepository vacationRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final AuthService authService;
    private final AuditService auditService;
    private final BalanceService balanceService;

    @Transactional(readOnly = true)
    public PageResponse<VacationResponse> findAll(Pageable pageable) {
        CustomUserDetails currentUser = authService.getCurrentUserDetails();
        Page<VacationRequest> page;

        if (currentUser.getRole() == Role.ADMIN) {
            page = vacationRequestRepository.findAll(pageable);
        } else if (currentUser.getRole() == Role.MANAGER) {
            page = vacationRequestRepository.findByManagerId(currentUser.getId(), pageable);
        } else {
            Employee employee = employeeRepository.findByUserId(currentUser.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Employee not found for current user"));
            page = vacationRequestRepository.findByEmployeeId(employee.getId(), pageable);
        }

        return PageResponse.from(page, VacationResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public VacationResponse findById(UUID id) {
        VacationRequest vacation = getVacationById(id);
        validateReadAccess(vacation);
        return VacationResponse.fromEntity(vacation);
    }

    @Transactional
    public VacationResponse create(VacationRequestDto request) {
        validateDates(request.startDate(), request.endDate());
        
        Employee employee = employeeRepository.findById(request.employeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", request.employeeId()));

        validateCreateAccess(employee);

        // Validate vacation balance
        int requestedDays = calculateDays(request.startDate(), request.endDate());
        validateBalance(employee.getId(), request.startDate().getYear(), requestedDays);

        // Check for overlapping vacations
        checkOverlap(request.startDate(), request.endDate(), null);

        VacationRequest vacation = VacationRequest.builder()
                .employee(employee)
                .startDate(request.startDate())
                .endDate(request.endDate())
                .reason(request.reason())
                .status(VacationStatus.PENDING)
                .build();

        vacation = vacationRequestRepository.save(vacation);

        User currentUser = authService.getCurrentUserEntity();
        auditService.log(currentUser, "CREATE_VACATION", "VacationRequest", vacation.getId(),
                Map.of("employeeName", employee.getFullName(),
                        "startDate", vacation.getStartDate().toString(),
                        "endDate", vacation.getEndDate().toString()));

        return VacationResponse.fromEntity(vacation);
    }

    @Transactional
    public VacationResponse update(UUID id, VacationRequestDto request) {
        VacationRequest vacation = getVacationById(id);

        if (vacation.getStatus() != VacationStatus.PENDING) {
            throw new BusinessException("Only PENDING vacation requests can be updated");
        }

        validateUpdateAccess(vacation);
        validateDates(request.startDate(), request.endDate());

        // Check for overlapping vacations (excluding current request)
        checkOverlap(request.startDate(), request.endDate(), vacation.getId());

        vacation.setStartDate(request.startDate());
        vacation.setEndDate(request.endDate());
        vacation.setReason(request.reason());

        vacation = vacationRequestRepository.save(vacation);

        User currentUser = authService.getCurrentUserEntity();
        auditService.log(currentUser, "UPDATE_VACATION", "VacationRequest", vacation.getId(),
                Map.of("startDate", vacation.getStartDate().toString(),
                        "endDate", vacation.getEndDate().toString()));

        return VacationResponse.fromEntity(vacation);
    }

    @Transactional
    public VacationResponse cancel(UUID id) {
        VacationRequest vacation = getVacationById(id);
        validateCancelAccess(vacation);

        if (vacation.getStatus() == VacationStatus.CANCELLED) {
            throw new BusinessException("Vacation request is already cancelled");
        }

        // If it was approved, restore balance
        if (vacation.getStatus() == VacationStatus.APPROVED) {
            int days = (int) vacation.getDaysCount();
            balanceService.restoreDays(
                    vacation.getEmployee().getId(),
                    vacation.getStartDate().getYear(),
                    days
            );
        }

        vacation.setStatus(VacationStatus.CANCELLED);
        vacation = vacationRequestRepository.save(vacation);

        User currentUser = authService.getCurrentUserEntity();
        auditService.log(currentUser, "CANCEL_VACATION", "VacationRequest", vacation.getId(),
                Map.of("employeeName", vacation.getEmployee().getFullName()));

        return VacationResponse.fromEntity(vacation);
    }

    @Transactional
    public VacationResponse approve(UUID id, VacationDecisionRequest request) {
        VacationRequest vacation = getVacationById(id);
        validateApprovalAccess(vacation);

        if (vacation.getStatus() != VacationStatus.PENDING) {
            throw new BusinessException("Only PENDING vacation requests can be approved");
        }

        // Re-validate overlap before approving (race condition protection)
        checkOverlap(vacation.getStartDate(), vacation.getEndDate(), vacation.getId());

        // Validate balance before approving
        int days = calculateDays(vacation.getStartDate(), vacation.getEndDate());
        validateBalance(vacation.getEmployee().getId(), vacation.getStartDate().getYear(), days);

        User currentUser = authService.getCurrentUserEntity();

        vacation.setStatus(VacationStatus.APPROVED);
        vacation.setDecisionAt(LocalDateTime.now());
        vacation.setDecidedBy(currentUser);
        vacation.setManagerComment(request != null ? request.comment() : null);

        vacation = vacationRequestRepository.save(vacation);

        // Deduct from balance (days already calculated above)
        balanceService.deductDays(
                vacation.getEmployee().getId(),
                vacation.getStartDate().getYear(),
                days
        );

        auditService.log(currentUser, "APPROVE_VACATION", "VacationRequest", vacation.getId(),
                Map.of("employeeName", vacation.getEmployee().getFullName(),
                        "startDate", vacation.getStartDate().toString(),
                        "endDate", vacation.getEndDate().toString(),
                        "days", days));

        return VacationResponse.fromEntity(vacation);
    }

    @Transactional
    public VacationResponse reject(UUID id, VacationDecisionRequest request) {
        VacationRequest vacation = getVacationById(id);
        validateApprovalAccess(vacation);

        if (vacation.getStatus() != VacationStatus.PENDING) {
            throw new BusinessException("Only PENDING vacation requests can be rejected");
        }

        User currentUser = authService.getCurrentUserEntity();

        vacation.setStatus(VacationStatus.REJECTED);
        vacation.setDecisionAt(LocalDateTime.now());
        vacation.setDecidedBy(currentUser);
        vacation.setManagerComment(request != null ? request.comment() : null);

        vacation = vacationRequestRepository.save(vacation);

        auditService.log(currentUser, "REJECT_VACATION", "VacationRequest", vacation.getId(),
                Map.of("employeeName", vacation.getEmployee().getFullName(),
                        "comment", request != null && request.comment() != null ? request.comment() : ""));

        return VacationResponse.fromEntity(vacation);
    }

    @Transactional(readOnly = true)
    public List<VacationResponse> findAllForCalendar(LocalDate startDate, LocalDate endDate) {
        List<VacationRequest> vacations = vacationRequestRepository.findApprovedInPeriod(startDate, endDate);
        return vacations.stream()
                .map(VacationResponse::fromEntity)
                .toList();
    }

    // ========== VALIDATION METHODS ==========

    private void checkOverlap(LocalDate startDate, LocalDate endDate, UUID excludeId) {
        List<VacationRequest> overlapping;
        
        if (excludeId != null) {
            overlapping = vacationRequestRepository.findOverlapping(startDate, endDate, excludeId);
        } else {
            overlapping = vacationRequestRepository.findOverlappingForNew(startDate, endDate);
        }

        if (!overlapping.isEmpty()) {
            VacationRequest conflict = overlapping.get(0);
            String statusPt = switch (conflict.getStatus()) {
                case PENDING -> "Pendente";
                case APPROVED -> "Aprovado";
                case REJECTED -> "Rejeitado";
                case CANCELLED -> "Cancelado";
            };
            String message = String.format(
                    "As datas solicitadas conflitam com férias já existentes de %s (de %s até %s, status: %s)",
                    conflict.getEmployee().getFullName(),
                    conflict.getStartDate(),
                    conflict.getEndDate(),
                    statusPt
            );
            log.warn("Overlap detected: {}", message);
            throw new VacationOverlapException(message);
        }
    }

    private void validateDates(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            throw new BusinessException("Start date must be before or equal to end date");
        }
    }

    private VacationRequest getVacationById(UUID id) {
        return vacationRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("VacationRequest", "id", id));
    }

    private void validateReadAccess(VacationRequest vacation) {
        CustomUserDetails currentUser = authService.getCurrentUserDetails();

        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }

        if (currentUser.getRole() == Role.MANAGER) {
            Employee employee = vacation.getEmployee();
            if (employee.getManager() != null && employee.getManager().getId().equals(currentUser.getId())) {
                return;
            }
        }

        if (currentUser.getRole() == Role.COLLABORATOR) {
            Employee employee = vacation.getEmployee();
            if (employee.getUser() != null && employee.getUser().getId().equals(currentUser.getId())) {
                return;
            }
        }

        throw new UnauthorizedException("You do not have permission to view this vacation request");
    }

    private void validateCreateAccess(Employee employee) {
        CustomUserDetails currentUser = authService.getCurrentUserDetails();

        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }

        if (currentUser.getRole() == Role.COLLABORATOR) {
            if (employee.getUser() == null || !employee.getUser().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("Collaborators can only create vacation requests for themselves");
            }
        }
    }

    private void validateUpdateAccess(VacationRequest vacation) {
        CustomUserDetails currentUser = authService.getCurrentUserDetails();

        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }

        Employee employee = vacation.getEmployee();
        if (currentUser.getRole() == Role.COLLABORATOR) {
            if (employee.getUser() == null || !employee.getUser().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("You can only update your own vacation requests");
            }
        }
    }

    private void validateCancelAccess(VacationRequest vacation) {
        CustomUserDetails currentUser = authService.getCurrentUserDetails();

        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }

        Employee employee = vacation.getEmployee();
        if (employee.getUser() == null || !employee.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only cancel your own vacation requests");
        }
    }

    private void validateApprovalAccess(VacationRequest vacation) {
        CustomUserDetails currentUser = authService.getCurrentUserDetails();

        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }

        if (currentUser.getRole() == Role.MANAGER) {
            Employee employee = vacation.getEmployee();
            if (employee.getManager() != null && employee.getManager().getId().equals(currentUser.getId())) {
                return;
            }
            throw new UnauthorizedException("Managers can only approve/reject vacation requests from their team");
        }

        throw new UnauthorizedException("Only Admin and Manager can approve/reject vacation requests");
    }

    private int calculateDays(LocalDate startDate, LocalDate endDate) {
        return (int) (endDate.toEpochDay() - startDate.toEpochDay()) + 1;
    }

    private void validateBalance(UUID employeeId, int year, int requestedDays) {
        var balance = balanceService.getOrCreateBalance(employeeId, year);
        int remainingDays = balance.getRemainingDays();
        
        if (requestedDays > remainingDays) {
            throw new BusinessException(
                String.format("Saldo de férias insuficiente. Você possui apenas %d dias disponíveis, mas solicitou %d dias.", 
                    remainingDays, requestedDays)
            );
        }
    }
}

package com.eltonsantos.backend.service;

import com.eltonsantos.backend.dto.request.VacationDecisionRequest;
import com.eltonsantos.backend.dto.request.VacationRequestDto;
import com.eltonsantos.backend.dto.response.VacationResponse;
import com.eltonsantos.backend.entity.Employee;
import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.entity.VacationBalance;
import com.eltonsantos.backend.entity.VacationRequest;
import com.eltonsantos.backend.enums.Role;
import com.eltonsantos.backend.enums.VacationStatus;
import com.eltonsantos.backend.exception.BusinessException;
import com.eltonsantos.backend.exception.UnauthorizedException;
import com.eltonsantos.backend.repository.EmployeeRepository;
import com.eltonsantos.backend.repository.VacationRequestRepository;
import com.eltonsantos.backend.security.CustomUserDetails;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.mockito.Mockito.lenient;

@ExtendWith(MockitoExtension.class)
class VacationServiceTest {

    @Mock
    private VacationRequestRepository vacationRequestRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private AuthService authService;

    @Mock
    private AuditService auditService;

    @Mock
    private BalanceService balanceService;

    @InjectMocks
    private VacationService vacationService;

    private Employee testEmployee;
    private User testUser;
    private User managerUser;
    private VacationRequest testVacation;
    private UUID employeeId;
    private UUID userId;
    private UUID managerId;

    @BeforeEach
    void setUp() {
        employeeId = UUID.randomUUID();
        userId = UUID.randomUUID();
        managerId = UUID.randomUUID();

        testUser = User.builder()
                .id(userId)
                .email("employee@example.com")
                .passwordHash("hash")
                .role(Role.COLLABORATOR)
                .build();

        managerUser = User.builder()
                .id(managerId)
                .email("manager@example.com")
                .passwordHash("hash")
                .role(Role.MANAGER)
                .build();

        testEmployee = Employee.builder()
                .id(employeeId)
                .fullName("John Doe")
                .email("employee@example.com")
                .user(testUser)
                .manager(managerUser)
                .active(true)
                .build();

        testVacation = VacationRequest.builder()
                .id(UUID.randomUUID())
                .employee(testEmployee)
                .startDate(LocalDate.of(2026, 3, 1))
                .endDate(LocalDate.of(2026, 3, 15))
                .status(VacationStatus.PENDING)
                .requestedAt(LocalDateTime.now())
                .build();
    }

    @Test
    @DisplayName("Should create vacation request when valid request is provided")
    void should_CreateVacation_When_ValidRequest() {
        VacationRequestDto request = new VacationRequestDto(
                employeeId,
                LocalDate.of(2026, 4, 1),
                LocalDate.of(2026, 4, 10),
                "Family vacation"
        );

        VacationBalance balance = VacationBalance.builder()
                .entitledDays(22)
                .usedDays(0)
                .remainingDays(22)
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(testUser);

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(testEmployee));
        when(authService.getCurrentUserDetails()).thenReturn(userDetails);
        when(authService.getCurrentUserEntity()).thenReturn(testUser);
        when(balanceService.getOrCreateBalance(employeeId, 2026)).thenReturn(balance);
        when(vacationRequestRepository.findOverlappingForNew(any(), any())).thenReturn(Collections.emptyList());
        when(vacationRequestRepository.save(any(VacationRequest.class))).thenAnswer(i -> {
            VacationRequest v = i.getArgument(0);
            v.setId(UUID.randomUUID());
            return v;
        });

        VacationResponse response = vacationService.create(request);

        assertNotNull(response);
        assertEquals(employeeId, response.employeeId());
        assertEquals(VacationStatus.PENDING, response.status());
        verify(vacationRequestRepository).save(any(VacationRequest.class));
        verify(auditService).log(any(), eq("CREATE_VACATION"), any(), any(), any());
    }

    @Test
    @DisplayName("Should throw BusinessException when start date is after end date")
    void should_ThrowException_When_StartDateAfterEndDate() {
        VacationRequestDto request = new VacationRequestDto(
                employeeId,
                LocalDate.of(2026, 3, 15),
                LocalDate.of(2026, 3, 1),
                "Invalid dates"
        );

        CustomUserDetails userDetails = new CustomUserDetails(testUser);

        lenient().when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(testEmployee));
        lenient().when(authService.getCurrentUserDetails()).thenReturn(userDetails);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> vacationService.create(request));

        assertEquals("Start date must be before or equal to end date", exception.getMessage());
        verify(vacationRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw BusinessException when vacation balance is insufficient")
    void should_ThrowException_When_InsufficientBalance() {
        VacationRequestDto request = new VacationRequestDto(
                employeeId,
                LocalDate.of(2026, 4, 1),
                LocalDate.of(2026, 4, 30),
                "Long vacation"
        );

        VacationBalance balance = VacationBalance.builder()
                .entitledDays(22)
                .usedDays(20)
                .remainingDays(2)
                .build();

        CustomUserDetails userDetails = new CustomUserDetails(testUser);

        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(testEmployee));
        when(authService.getCurrentUserDetails()).thenReturn(userDetails);
        when(balanceService.getOrCreateBalance(employeeId, 2026)).thenReturn(balance);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> vacationService.create(request));

        assertTrue(exception.getMessage().contains("Saldo de férias insuficiente"));
        verify(vacationRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should approve vacation when manager approves pending request")
    void should_ApproveVacation_When_ManagerApproves() {
        CustomUserDetails managerDetails = new CustomUserDetails(managerUser);
        VacationDecisionRequest decision = new VacationDecisionRequest("Approved as requested");

        when(vacationRequestRepository.findById(testVacation.getId())).thenReturn(Optional.of(testVacation));
        when(authService.getCurrentUserDetails()).thenReturn(managerDetails);
        when(authService.getCurrentUserEntity()).thenReturn(managerUser);
        when(vacationRequestRepository.findOverlapping(any(), any(), any())).thenReturn(Collections.emptyList());
        
        VacationBalance balance = VacationBalance.builder()
                .entitledDays(22)
                .usedDays(0)
                .remainingDays(22)
                .build();
        when(balanceService.getOrCreateBalance(any(), anyInt())).thenReturn(balance);
        when(vacationRequestRepository.save(any(VacationRequest.class))).thenAnswer(i -> i.getArgument(0));

        VacationResponse response = vacationService.approve(testVacation.getId(), decision);

        assertNotNull(response);
        assertEquals(VacationStatus.APPROVED, response.status());
        verify(balanceService).deductDays(any(), anyInt(), anyInt());
        verify(auditService).log(any(), eq("APPROVE_VACATION"), any(), any(), any());
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when user tries to approve own vacation")
    void should_ThrowException_When_ApprovingOwnVacation() {
        User managerAsEmployee = User.builder()
                .id(managerId)
                .email("manager@example.com")
                .passwordHash("hash")
                .role(Role.MANAGER)
                .build();

        Employee managerEmployee = Employee.builder()
                .id(UUID.randomUUID())
                .fullName("Manager Person")
                .email("manager@example.com")
                .user(managerAsEmployee)
                .active(true)
                .build();

        VacationRequest managerVacation = VacationRequest.builder()
                .id(UUID.randomUUID())
                .employee(managerEmployee)
                .startDate(LocalDate.of(2026, 5, 1))
                .endDate(LocalDate.of(2026, 5, 10))
                .status(VacationStatus.PENDING)
                .build();

        CustomUserDetails managerDetails = new CustomUserDetails(managerAsEmployee);

        when(vacationRequestRepository.findById(managerVacation.getId())).thenReturn(Optional.of(managerVacation));
        when(authService.getCurrentUserDetails()).thenReturn(managerDetails);

        UnauthorizedException exception = assertThrows(UnauthorizedException.class,
                () -> vacationService.approve(managerVacation.getId(), null));

        assertEquals("You cannot approve your own vacation request", exception.getMessage());
        verify(vacationRequestRepository, never()).save(any());
    }
}

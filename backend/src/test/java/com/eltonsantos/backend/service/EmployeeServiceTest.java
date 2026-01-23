package com.eltonsantos.backend.service;

import com.eltonsantos.backend.dto.request.EmployeeRequest;
import com.eltonsantos.backend.dto.response.EmployeeResponse;
import com.eltonsantos.backend.entity.Employee;
import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.enums.Role;
import com.eltonsantos.backend.exception.BusinessException;
import com.eltonsantos.backend.repository.EmployeeRepository;
import com.eltonsantos.backend.repository.UserRepository;
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
class EmployeeServiceTest {

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private VacationBalanceRepository vacationBalanceRepository;

    @Mock
    private AuditService auditService;

    @Mock
    private AuthService authService;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee testEmployee;
    private User adminUser;
    private UUID employeeId;

    @BeforeEach
    void setUp() {
        employeeId = UUID.randomUUID();
        
        adminUser = User.builder()
                .id(UUID.randomUUID())
                .email("admin@example.com")
                .role(Role.ADMIN)
                .build();

        testEmployee = Employee.builder()
                .id(employeeId)
                .fullName("John Doe")
                .email("john@example.com")
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Should create employee successfully when valid request is provided")
    void should_CreateEmployee_When_ValidRequest() {
        EmployeeRequest request = new EmployeeRequest(
                "Jane Smith",
                "jane@example.com",
                null,
                null
        );

        when(employeeRepository.existsByEmail("jane@example.com")).thenReturn(false);
        when(employeeRepository.save(any(Employee.class))).thenAnswer(i -> {
            Employee e = i.getArgument(0);
            e.setId(UUID.randomUUID());
            return e;
        });
        when(vacationBalanceRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(authService.getCurrentUserEntity()).thenReturn(adminUser);

        EmployeeResponse response = employeeService.create(request);

        assertNotNull(response);
        assertEquals("Jane Smith", response.fullName());
        assertEquals("jane@example.com", response.email());
        assertTrue(response.active());
        verify(employeeRepository).save(any(Employee.class));
        verify(vacationBalanceRepository).save(any());
        verify(auditService).log(any(), eq("CREATE_EMPLOYEE"), any(), any(), any());
    }

    @Test
    @DisplayName("Should perform soft delete when deleting employee")
    void should_SoftDelete_When_Deleting() {
        when(employeeRepository.findById(employeeId)).thenReturn(Optional.of(testEmployee));
        when(employeeRepository.save(any(Employee.class))).thenAnswer(i -> i.getArgument(0));
        when(authService.getCurrentUserEntity()).thenReturn(adminUser);

        employeeService.delete(employeeId);

        assertFalse(testEmployee.getActive());
        verify(employeeRepository).save(testEmployee);
        verify(employeeRepository, never()).delete(any());
        verify(auditService).log(any(), eq("DELETE_EMPLOYEE"), any(), any(), any());
    }
}

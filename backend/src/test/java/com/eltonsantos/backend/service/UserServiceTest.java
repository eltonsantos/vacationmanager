package com.eltonsantos.backend.service;

import com.eltonsantos.backend.dto.request.CreateUserRequest;
import com.eltonsantos.backend.dto.response.UserResponse;
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
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private VacationBalanceRepository vacationBalanceRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuditService auditService;

    @Mock
    private AuthService authService;

    @InjectMocks
    private UserService userService;

    private User adminUser;
    private UUID adminId;

    @BeforeEach
    void setUp() {
        adminId = UUID.randomUUID();
        adminUser = User.builder()
                .id(adminId)
                .email("admin@example.com")
                .role(Role.ADMIN)
                .build();
    }

    @Test
    @DisplayName("Should create user successfully when valid request is provided")
    void should_CreateUser_When_ValidRequest() {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail("newuser@example.com");
        request.setPassword("password123");
        request.setRole(Role.MANAGER);
        request.setFullName("New Manager");

        when(userRepository.existsByEmail("newuser@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(UUID.randomUUID());
            return u;
        });
        when(employeeRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(vacationBalanceRepository.save(any())).thenAnswer(i -> i.getArgument(0));
        when(authService.getCurrentUserEntity()).thenReturn(adminUser);

        UserResponse response = userService.create(request);

        assertNotNull(response);
        assertEquals("newuser@example.com", response.email());
        assertEquals(Role.MANAGER, response.role());
        verify(userRepository).save(any(User.class));
        verify(employeeRepository).save(any());
        verify(auditService).log(any(), eq("CREATE_USER"), any(), any(), any());
    }

    @Test
    @DisplayName("Should throw BusinessException when email already exists")
    void should_ThrowException_When_DuplicateEmail() {
        CreateUserRequest request = new CreateUserRequest();
        request.setEmail("existing@example.com");
        request.setPassword("password123");
        request.setRole(Role.COLLABORATOR);
        request.setFullName("John Doe");
        request.setManagerId(adminId);

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> userService.create(request));

        assertEquals("Email já está em uso", exception.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should throw BusinessException when admin tries to delete own account")
    void should_ThrowException_When_DeletingSelf() {
        when(userRepository.findById(adminId)).thenReturn(Optional.of(adminUser));
        when(authService.getCurrentUserId()).thenReturn(adminId);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> userService.delete(adminId));

        assertEquals("Você não pode deletar sua própria conta", exception.getMessage());
        verify(userRepository, never()).delete(any());
    }
}

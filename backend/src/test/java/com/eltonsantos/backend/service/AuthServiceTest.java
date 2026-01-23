package com.eltonsantos.backend.service;

import com.eltonsantos.backend.dto.request.ChangePasswordRequest;
import com.eltonsantos.backend.dto.request.LoginRequest;
import com.eltonsantos.backend.dto.request.SignUpRequest;
import com.eltonsantos.backend.dto.response.AuthResponse;
import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.enums.Role;
import com.eltonsantos.backend.exception.BusinessException;
import com.eltonsantos.backend.repository.EmployeeRepository;
import com.eltonsantos.backend.repository.UserRepository;
import com.eltonsantos.backend.repository.VacationBalanceRepository;
import com.eltonsantos.backend.security.CustomUserDetails;
import com.eltonsantos.backend.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmployeeRepository employeeRepository;

    @Mock
    private VacationBalanceRepository vacationBalanceRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private UUID userId;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        testUser = User.builder()
                .id(userId)
                .email("test@example.com")
                .passwordHash("hashedPassword")
                .role(Role.COLLABORATOR)
                .build();
    }

    @Test
    @DisplayName("Should return AuthResponse when login is successful")
    void should_ReturnAuthResponse_When_LoginSuccessful() {
        LoginRequest request = new LoginRequest("test@example.com", "password123");
        
        CustomUserDetails userDetails = new CustomUserDetails(testUser);
        
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(jwtTokenProvider.generateToken(authentication)).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwt-token", response.token());
        assertEquals("test@example.com", response.email());
        assertEquals(Role.COLLABORATOR, response.role());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    @DisplayName("Should throw BusinessException when signing up with ADMIN role")
    void should_ThrowException_When_SignUpWithAdminRole() {
        SignUpRequest request = new SignUpRequest(
                "Admin User",
                "admin@example.com",
                "password123",
                Role.ADMIN
        );

        BusinessException exception = assertThrows(BusinessException.class,
                () -> authService.signUp(request));

        assertEquals("Cannot register as ADMIN", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw BusinessException when email already exists")
    void should_ThrowException_When_EmailAlreadyExists() {
        SignUpRequest request = new SignUpRequest(
                "John Doe",
                "existing@example.com",
                "password123",
                Role.COLLABORATOR
        );

        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        BusinessException exception = assertThrows(BusinessException.class,
                () -> authService.signUp(request));

        assertEquals("Email already registered", exception.getMessage());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should change password when current password is correct")
    void should_ChangePassword_When_CurrentPasswordIsCorrect() {
        ChangePasswordRequest request = new ChangePasswordRequest();
        request.setCurrentPassword("oldPassword");
        request.setNewPassword("newPassword123");

        when(passwordEncoder.matches("oldPassword", "hashedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPassword123")).thenReturn("newHashedPassword");
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        AuthService spyService = spy(authService);
        doReturn(userId).when(spyService).getCurrentUserId();

        spyService.changePassword(request);

        verify(passwordEncoder).matches("oldPassword", "hashedPassword");
        verify(passwordEncoder).encode("newPassword123");
        verify(userRepository).save(testUser);
        assertEquals("newHashedPassword", testUser.getPasswordHash());
    }
}

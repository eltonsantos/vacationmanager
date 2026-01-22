package com.eltonsantos.backend.service;

import com.eltonsantos.backend.dto.request.ChangePasswordRequest;
import com.eltonsantos.backend.dto.request.LoginRequest;
import com.eltonsantos.backend.dto.request.SignUpRequest;
import com.eltonsantos.backend.dto.request.UpdateProfileRequest;
import com.eltonsantos.backend.dto.response.AuthResponse;
import com.eltonsantos.backend.dto.response.ProfileResponse;
import com.eltonsantos.backend.dto.response.UserResponse;
import com.eltonsantos.backend.entity.Employee;
import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.entity.VacationBalance;
import com.eltonsantos.backend.enums.Role;
import com.eltonsantos.backend.exception.BusinessException;
import com.eltonsantos.backend.exception.ResourceNotFoundException;
import com.eltonsantos.backend.repository.EmployeeRepository;
import com.eltonsantos.backend.repository.UserRepository;
import com.eltonsantos.backend.repository.VacationBalanceRepository;
import com.eltonsantos.backend.security.CustomUserDetails;
import com.eltonsantos.backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final VacationBalanceRepository vacationBalanceRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        return new AuthResponse(
                token,
                userDetails.getId(),
                userDetails.getEmail(),
                userDetails.getRole()
        );
    }

    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        // Validate role - only MANAGER or COLLABORATOR allowed
        if (request.role() == Role.ADMIN) {
            throw new BusinessException("Cannot register as ADMIN");
        }

        // Check if email already exists
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email already registered");
        }

        if (employeeRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email already registered");
        }

        // Create User
        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(request.role())
                .build();
        user = userRepository.save(user);

        // Create Employee linked to User
        Employee employee = Employee.builder()
                .fullName(request.fullName())
                .email(request.email())
                .user(user)
                .active(true)
                .build();
        employee = employeeRepository.save(employee);

        // Create VacationBalance for current year
        VacationBalance balance = VacationBalance.builder()
                .employee(employee)
                .year(Year.now().getValue())
                .entitledDays(22)
                .usedDays(0)
                .remainingDays(22)
                .build();
        vacationBalanceRepository.save(balance);

        // Auto-login after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        return new AuthResponse(
                token,
                user.getId(),
                user.getEmail(),
                user.getRole()
        );
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        UUID userId = getCurrentUserId();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        Employee employee = employeeRepository.findByUserId(userId).orElse(null);
        return UserResponse.fromEntity(user, employee);
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile() {
        User user = getCurrentUserEntity();
        Employee employee = employeeRepository.findByUserId(user.getId()).orElse(null);
        return ProfileResponse.fromEntities(user, employee);
    }

    public UUID getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails.getId();
        }
        throw new ResourceNotFoundException("Current user not found");
    }

    public User getCurrentUserEntity() {
        UUID userId = getCurrentUserId();
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
    }

    public CustomUserDetails getCurrentUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return userDetails;
        }
        throw new ResourceNotFoundException("Current user not found");
    }

    @Transactional
    public ProfileResponse updateProfile(UpdateProfileRequest request) {
        User user = getCurrentUserEntity();
        
        // Find and update the associated employee
        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElse(null);
        
        if (employee != null) {
            employee.setFullName(request.getFullName());
            employeeRepository.save(employee);
        }
        
        return ProfileResponse.fromEntities(user, employee);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = getCurrentUserEntity();
        
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BusinessException("Senha atual incorreta");
        }
        
        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}

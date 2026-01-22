package com.eltonsantos.backend.service;

import com.eltonsantos.backend.dto.request.CreateUserRequest;
import com.eltonsantos.backend.dto.request.UpdateUserRequest;
import com.eltonsantos.backend.dto.response.PageResponse;
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
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final VacationBalanceRepository vacationBalanceRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuditService auditService;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public PageResponse<UserResponse> findAll(Pageable pageable) {
        Page<User> page = userRepository.findAll(pageable);
        return PageResponse.from(page, UserResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public UserResponse findById(UUID id) {
        User user = getUserById(id);
        return UserResponse.fromEntity(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findManagers() {
        return userRepository.findByRole(Role.MANAGER).stream()
                .map(UserResponse::fromEntity)
                .toList();
    }

    @Transactional
    public UserResponse create(CreateUserRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email já está em uso");
        }

        // Validate: COLLABORATOR must have a manager
        if (request.getRole() == Role.COLLABORATOR && request.getManagerId() == null) {
            throw new BusinessException("Colaboradores devem ser associados a um gestor");
        }

        // Validate manager exists and has MANAGER role
        User manager = null;
        if (request.getManagerId() != null) {
            manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", "id", request.getManagerId()));
            if (manager.getRole() != Role.MANAGER && manager.getRole() != Role.ADMIN) {
                throw new BusinessException("O usuário selecionado não é um gestor");
            }
        }

        // Create user
        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        user = userRepository.save(user);

        // Create employee for MANAGER and COLLABORATOR roles
        if (request.getRole() != Role.ADMIN) {
            Employee employee = Employee.builder()
                    .fullName(request.getFullName())
                    .email(request.getEmail())
                    .user(user)
                    .manager(manager) // Associate with manager (null for MANAGER role)
                    .active(true)
                    .build();
            employee = employeeRepository.save(employee);

            // Create vacation balance for current year
            VacationBalance balance = VacationBalance.builder()
                    .employee(employee)
                    .year(Year.now().getValue())
                    .entitledDays(22)
                    .usedDays(0)
                    .remainingDays(22)
                    .build();
            vacationBalanceRepository.save(balance);
        }

        User currentUser = authService.getCurrentUserEntity();
        auditService.log(currentUser, "CREATE_USER", "User", user.getId(),
                Map.of("email", user.getEmail(), "role", user.getRole().name()));

        return UserResponse.fromEntity(user);
    }

    @Transactional
    public UserResponse update(UUID id, UpdateUserRequest request) {
        User user = getUserById(id);

        // Check if email is being changed and if it's already in use
        if (!user.getEmail().equals(request.getEmail()) && userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("Email já está em uso");
        }

        user.setEmail(request.getEmail());
        user.setRole(request.getRole());

        // Update password only if provided
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        user = userRepository.save(user);

        // Update employee email if exists
        employeeRepository.findByUserId(id).ifPresent(employee -> {
            employee.setEmail(request.getEmail());
            employeeRepository.save(employee);
        });

        User currentUser = authService.getCurrentUserEntity();
        auditService.log(currentUser, "UPDATE_USER", "User", user.getId(),
                Map.of("email", user.getEmail(), "role", user.getRole().name()));

        return UserResponse.fromEntity(user);
    }

    @Transactional
    public void delete(UUID id) {
        User user = getUserById(id);

        // Prevent admin from deleting themselves
        UUID currentUserId = authService.getCurrentUserId();
        if (id.equals(currentUserId)) {
            throw new BusinessException("Você não pode deletar sua própria conta");
        }

        // Soft delete associated employee if exists
        employeeRepository.findByUserId(id).ifPresent(employee -> {
            employee.setActive(false);
            employee.setUser(null);
            employeeRepository.save(employee);
        });

        User currentUser = authService.getCurrentUserEntity();
        auditService.log(currentUser, "DELETE_USER", "User", user.getId(),
                Map.of("email", user.getEmail()));

        userRepository.delete(user);
    }

    private User getUserById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }
}

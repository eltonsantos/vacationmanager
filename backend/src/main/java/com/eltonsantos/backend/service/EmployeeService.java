package com.eltonsantos.backend.service;

import com.eltonsantos.backend.dto.request.EmployeeRequest;
import com.eltonsantos.backend.dto.response.EmployeeResponse;
import com.eltonsantos.backend.dto.response.PageResponse;
import com.eltonsantos.backend.entity.Employee;
import com.eltonsantos.backend.entity.User;
import com.eltonsantos.backend.entity.VacationBalance;
import com.eltonsantos.backend.enums.Role;
import com.eltonsantos.backend.exception.BusinessException;
import com.eltonsantos.backend.exception.ResourceNotFoundException;
import com.eltonsantos.backend.exception.UnauthorizedException;
import com.eltonsantos.backend.repository.EmployeeRepository;
import com.eltonsantos.backend.repository.UserRepository;
import com.eltonsantos.backend.repository.VacationBalanceRepository;
import com.eltonsantos.backend.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final VacationBalanceRepository vacationBalanceRepository;
    private final AuditService auditService;
    private final AuthService authService;

    @Transactional(readOnly = true)
    public PageResponse<EmployeeResponse> findAll(Pageable pageable) {
        CustomUserDetails currentUser = authService.getCurrentUserDetails();
        Page<Employee> page;

        if (currentUser.getRole() == Role.ADMIN) {
            page = employeeRepository.findAllActive(pageable);
        } else if (currentUser.getRole() == Role.MANAGER) {
            page = employeeRepository.findByManagerId(currentUser.getId(), pageable);
        } else {
            throw new UnauthorizedException("Collaborators cannot list all employees");
        }

        return PageResponse.from(page, EmployeeResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse findById(UUID id) {
        Employee employee = getEmployeeById(id);
        validateReadAccess(employee);
        return EmployeeResponse.fromEntity(employee);
    }

    @Transactional
    public EmployeeResponse create(EmployeeRequest request) {
        if (employeeRepository.existsByEmail(request.email())) {
            throw new BusinessException("Employee with this email already exists");
        }

        Employee employee = Employee.builder()
                .fullName(request.fullName())
                .email(request.email())
                .active(true)
                .build();

        if (request.managerId() != null) {
            User manager = userRepository.findById(request.managerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", "id", request.managerId()));
            if (manager.getRole() != Role.MANAGER && manager.getRole() != Role.ADMIN) {
                throw new BusinessException("Specified user is not a manager");
            }
            employee.setManager(manager);
        }

        if (request.userId() != null) {
            User user = userRepository.findById(request.userId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.userId()));
            employee.setUser(user);
        }

        employee = employeeRepository.save(employee);

        // Create initial vacation balance for current year
        createInitialBalance(employee);

        User currentUser = authService.getCurrentUserEntity();
        auditService.log(currentUser, "CREATE_EMPLOYEE", "Employee", employee.getId(),
                Map.of("fullName", employee.getFullName(), "email", employee.getEmail()));

        return EmployeeResponse.fromEntity(employee);
    }

    @Transactional
    public EmployeeResponse update(UUID id, EmployeeRequest request) {
        Employee employee = getEmployeeById(id);

        if (!employee.getEmail().equals(request.email()) && employeeRepository.existsByEmail(request.email())) {
            throw new BusinessException("Employee with this email already exists");
        }

        employee.setFullName(request.fullName());
        employee.setEmail(request.email());

        if (request.managerId() != null) {
            User manager = userRepository.findById(request.managerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager", "id", request.managerId()));
            employee.setManager(manager);
        } else {
            employee.setManager(null);
        }

        if (request.userId() != null) {
            User user = userRepository.findById(request.userId())
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.userId()));
            employee.setUser(user);
        }

        employee = employeeRepository.save(employee);

        User currentUser = authService.getCurrentUserEntity();
        auditService.log(currentUser, "UPDATE_EMPLOYEE", "Employee", employee.getId(),
                Map.of("fullName", employee.getFullName()));

        return EmployeeResponse.fromEntity(employee);
    }

    @Transactional
    public void delete(UUID id) {
        Employee employee = getEmployeeById(id);
        employee.setActive(false);
        employeeRepository.save(employee);

        User currentUser = authService.getCurrentUserEntity();
        auditService.log(currentUser, "DELETE_EMPLOYEE", "Employee", employee.getId(),
                Map.of("fullName", employee.getFullName()));
    }

    private Employee getEmployeeById(UUID id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
    }

    private void validateReadAccess(Employee employee) {
        CustomUserDetails currentUser = authService.getCurrentUserDetails();

        if (currentUser.getRole() == Role.ADMIN) {
            return;
        }

        if (currentUser.getRole() == Role.MANAGER) {
            if (employee.getManager() == null || !employee.getManager().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("You can only view employees in your team");
            }
            return;
        }

        if (currentUser.getRole() == Role.COLLABORATOR) {
            if (employee.getUser() == null || !employee.getUser().getId().equals(currentUser.getId())) {
                throw new UnauthorizedException("You can only view your own profile");
            }
        }
    }

    private void createInitialBalance(Employee employee) {
        VacationBalance balance = VacationBalance.builder()
                .employee(employee)
                .year(Year.now().getValue())
                .entitledDays(22)
                .usedDays(0)
                .remainingDays(22)
                .build();
        vacationBalanceRepository.save(balance);
    }

    @Transactional(readOnly = true)
    public Employee getEmployeeByUserId(UUID userId) {
        return employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for user"));
    }
}

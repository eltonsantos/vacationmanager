package com.eltonsantos.backend.repository;

import com.eltonsantos.backend.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, UUID> {

    Optional<Employee> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Employee> findByUserId(UUID userId);

    @Query("SELECT e FROM Employee e WHERE e.manager.id = :managerId AND e.active = true")
    List<Employee> findByManagerId(@Param("managerId") UUID managerId);

    @Query("SELECT e FROM Employee e WHERE e.manager.id = :managerId AND e.active = true")
    Page<Employee> findByManagerId(@Param("managerId") UUID managerId, Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.active = true")
    Page<Employee> findAllActive(Pageable pageable);

    @Query("SELECT e FROM Employee e WHERE e.active = true AND " +
           "(LOWER(e.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Employee> searchByNameOrEmail(@Param("search") String search, Pageable pageable);
}

package com.eltonsantos.backend.repository;

import com.eltonsantos.backend.entity.VacationBalance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VacationBalanceRepository extends JpaRepository<VacationBalance, UUID> {

    Optional<VacationBalance> findByEmployeeIdAndYear(UUID employeeId, Integer year);

    List<VacationBalance> findByEmployeeId(UUID employeeId);

    List<VacationBalance> findByYear(Integer year);
}

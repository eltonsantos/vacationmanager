package com.eltonsantos.backend.repository;

import com.eltonsantos.backend.entity.VacationRequest;
import com.eltonsantos.backend.enums.VacationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface VacationRequestRepository extends JpaRepository<VacationRequest, UUID> {

    List<VacationRequest> findByEmployeeId(UUID employeeId);

    Page<VacationRequest> findByEmployeeId(UUID employeeId, Pageable pageable);

    @Query("SELECT vr FROM VacationRequest vr WHERE vr.employee.manager.id = :managerId")
    Page<VacationRequest> findByManagerId(@Param("managerId") UUID managerId, Pageable pageable);

    @Query("SELECT vr FROM VacationRequest vr WHERE vr.status = :status")
    Page<VacationRequest> findByStatus(@Param("status") VacationStatus status, Pageable pageable);

    /**
     * Find overlapping vacation requests.
     * Overlap condition: newStart <= existingEnd AND newEnd >= existingStart
     * Only considers PENDING and APPROVED statuses.
     */
    @Query("SELECT vr FROM VacationRequest vr WHERE " +
           "vr.status IN ('PENDING', 'APPROVED') AND " +
           "vr.id != :excludeId AND " +
           ":newStart <= vr.endDate AND :newEnd >= vr.startDate")
    List<VacationRequest> findOverlapping(
            @Param("newStart") LocalDate newStart,
            @Param("newEnd") LocalDate newEnd,
            @Param("excludeId") UUID excludeId);

    /**
     * Find overlapping for new requests (no ID to exclude).
     */
    @Query("SELECT vr FROM VacationRequest vr WHERE " +
           "vr.status IN ('PENDING', 'APPROVED') AND " +
           ":newStart <= vr.endDate AND :newEnd >= vr.startDate")
    List<VacationRequest> findOverlappingForNew(
            @Param("newStart") LocalDate newStart,
            @Param("newEnd") LocalDate newEnd);

    @Query("SELECT vr FROM VacationRequest vr WHERE " +
           "vr.status = 'APPROVED' AND " +
           "vr.startDate >= :startDate AND vr.endDate <= :endDate")
    List<VacationRequest> findApprovedInPeriod(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT vr FROM VacationRequest vr WHERE " +
           "vr.employee.id = :employeeId AND " +
           "vr.status = 'APPROVED' AND " +
           "YEAR(vr.startDate) = :year")
    List<VacationRequest> findApprovedByEmployeeAndYear(
            @Param("employeeId") UUID employeeId,
            @Param("year") int year);
}

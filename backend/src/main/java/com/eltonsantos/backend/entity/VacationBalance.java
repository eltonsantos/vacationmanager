package com.eltonsantos.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "vacation_balances", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"employee_id", "year"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VacationBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(nullable = false)
    private Integer year;

    @Column(name = "entitled_days", nullable = false)
    @Builder.Default
    private Integer entitledDays = 22;

    @Column(name = "used_days", nullable = false)
    @Builder.Default
    private Integer usedDays = 0;

    @Column(name = "remaining_days", nullable = false)
    @Builder.Default
    private Integer remainingDays = 22;

    public void deductDays(int days) {
        this.usedDays += days;
        this.remainingDays = this.entitledDays - this.usedDays;
    }

    public void restoreDays(int days) {
        this.usedDays -= days;
        if (this.usedDays < 0) this.usedDays = 0;
        this.remainingDays = this.entitledDays - this.usedDays;
    }
}

package com.keyhole.timesheet.repository;

import com.keyhole.timesheet.entity.TimeEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TimeEntryRepository extends JpaRepository<TimeEntry, Long> {

    List<TimeEntry> findByEmployeeId(Long employeeId);

    List<TimeEntry> findByProjectId(Long projectId);

    List<TimeEntry> findByEmployeeIdAndDateBetween(Long employeeId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.hours), 0) FROM TimeEntry t WHERE t.employee.id = :employeeId AND t.date = :date")
    BigDecimal sumHoursByEmployeeIdAndDate(@Param("employeeId") Long employeeId, @Param("date") LocalDate date);
}

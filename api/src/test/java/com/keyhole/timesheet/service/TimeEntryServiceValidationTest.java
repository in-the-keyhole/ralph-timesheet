package com.keyhole.timesheet.service;

import com.keyhole.timesheet.dto.TimeEntryRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
@Transactional
class TimeEntryServiceValidationTest {

    @Autowired
    private TimeEntryService timeEntryService;

    @Test
    void shouldRejectHoursNotInQuarterIncrements() {
        TimeEntryRequest request = TimeEntryRequest.builder()
                .employeeId(1L)
                .projectId(1L)
                .date(LocalDate.of(2025, 1, 10))
                .hours(new BigDecimal("1.30"))
                .description("Invalid hours")
                .build();

        assertThatThrownBy(() -> timeEntryService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("0.25 increments");
    }

    @Test
    void shouldAcceptHoursInQuarterIncrements() {
        TimeEntryRequest request = TimeEntryRequest.builder()
                .employeeId(1L)
                .projectId(1L)
                .date(LocalDate.of(2025, 1, 10))
                .hours(new BigDecimal("2.75"))
                .description("Valid hours")
                .build();

        // Should not throw
        timeEntryService.create(request);
    }

    @Test
    void shouldRejectFutureDate() {
        TimeEntryRequest request = TimeEntryRequest.builder()
                .employeeId(1L)
                .projectId(1L)
                .date(LocalDate.now().plusDays(1))
                .hours(new BigDecimal("4.00"))
                .description("Future date")
                .build();

        assertThatThrownBy(() -> timeEntryService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("future");
    }

    @Test
    void shouldAcceptTodayDate() {
        TimeEntryRequest request = TimeEntryRequest.builder()
                .employeeId(2L)
                .projectId(2L)
                .date(LocalDate.now())
                .hours(new BigDecimal("4.00"))
                .description("Today")
                .build();

        // Should not throw
        timeEntryService.create(request);
    }

    @Test
    void shouldRejectWhenDailyHoursExceed24() {
        // Employee 1 already has 8 hours on 2025-01-06 from seed data
        TimeEntryRequest request = TimeEntryRequest.builder()
                .employeeId(1L)
                .projectId(1L)
                .date(LocalDate.of(2025, 1, 6))
                .hours(new BigDecimal("16.25"))
                .description("Too many hours")
                .build();

        assertThatThrownBy(() -> timeEntryService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("24");
    }

    @Test
    void shouldAcceptWhenDailyHoursEqualExactly24() {
        // Employee 1 has 8 hours on 2025-01-06, add 16 more = 24 total
        TimeEntryRequest request = TimeEntryRequest.builder()
                .employeeId(1L)
                .projectId(1L)
                .date(LocalDate.of(2025, 1, 6))
                .hours(new BigDecimal("16.00"))
                .description("Max hours")
                .build();

        // Should not throw
        timeEntryService.create(request);
    }

    @Test
    void shouldRejectHoursBelow025() {
        TimeEntryRequest request = TimeEntryRequest.builder()
                .employeeId(1L)
                .projectId(1L)
                .date(LocalDate.of(2025, 1, 10))
                .hours(new BigDecimal("0.10"))
                .description("Too few hours")
                .build();

        assertThatThrownBy(() -> timeEntryService.create(request))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void shouldRejectHoursAbove24() {
        TimeEntryRequest request = TimeEntryRequest.builder()
                .employeeId(1L)
                .projectId(1L)
                .date(LocalDate.of(2025, 1, 10))
                .hours(new BigDecimal("24.25"))
                .description("Over 24 hours")
                .build();

        assertThatThrownBy(() -> timeEntryService.create(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("between 0.25 and 24");
    }
}

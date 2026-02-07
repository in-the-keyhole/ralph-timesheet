package com.keyhole.timesheet.repository;

import com.keyhole.timesheet.entity.TimeEntry;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDate;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class TimeEntryRepositoryTest {

    @Autowired
    private TimeEntryRepository timeEntryRepository;

    @Test
    void shouldLoadSeedData() {
        List<TimeEntry> entries = timeEntryRepository.findAll();
        assertThat(entries).hasSize(4);
    }

    @Test
    void shouldFindByEmployeeId() {
        List<TimeEntry> entries = timeEntryRepository.findByEmployeeId(1L);
        assertThat(entries).hasSize(2);
    }

    @Test
    void shouldFindByProjectId() {
        List<TimeEntry> entries = timeEntryRepository.findByProjectId(1L);
        assertThat(entries).hasSize(2);
    }

    @Test
    void shouldFindByEmployeeIdAndDateBetween() {
        List<TimeEntry> entries = timeEntryRepository.findByEmployeeIdAndDateBetween(
                1L, LocalDate.of(2025, 1, 6), LocalDate.of(2025, 1, 6));
        assertThat(entries).hasSize(1);

        List<TimeEntry> weekEntries = timeEntryRepository.findByEmployeeIdAndDateBetween(
                1L, LocalDate.of(2025, 1, 1), LocalDate.of(2025, 1, 31));
        assertThat(weekEntries).hasSize(2);
    }

    @Test
    void shouldReturnEmptyForNonExistentEmployee() {
        List<TimeEntry> entries = timeEntryRepository.findByEmployeeId(999L);
        assertThat(entries).isEmpty();
    }
}

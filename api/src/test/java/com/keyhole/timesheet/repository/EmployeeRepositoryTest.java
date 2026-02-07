package com.keyhole.timesheet.repository;

import com.keyhole.timesheet.entity.Employee;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class EmployeeRepositoryTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Test
    void shouldLoadSeedData() {
        List<Employee> employees = employeeRepository.findAll();
        assertThat(employees).hasSize(3);
    }

    @Test
    void shouldFindEmployeeByEmail() {
        List<Employee> employees = employeeRepository.findAll();
        assertThat(employees)
                .extracting(Employee::getEmail)
                .contains("john.doe@keyhole.com", "jane.smith@keyhole.com", "bob.johnson@keyhole.com");
    }

    @Test
    void shouldSaveNewEmployee() {
        Employee employee = Employee.builder()
                .firstName("Alice")
                .lastName("Williams")
                .email("alice.williams@keyhole.com")
                .department("Marketing")
                .build();

        Employee saved = employeeRepository.save(employee);

        assertThat(saved.getId()).isNotNull();
        assertThat(employeeRepository.findAll()).hasSize(4);
    }
}

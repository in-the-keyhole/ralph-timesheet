package com.keyhole.timesheet.controller;

import com.keyhole.timesheet.dto.EmployeeRequest;
import com.keyhole.timesheet.dto.EmployeeResponse;
import com.keyhole.timesheet.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
@RequiredArgsConstructor
@Tag(name = "Employees", description = "Employee management endpoints")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    @Operation(summary = "Get all employees")
    public List<EmployeeResponse> getAll() {
        return employeeService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee by ID")
    @ApiResponse(responseCode = "200", description = "Employee found")
    @ApiResponse(responseCode = "404", description = "Employee not found")
    public EmployeeResponse getById(@PathVariable Long id) {
        return employeeService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new employee")
    @ApiResponse(responseCode = "201", description = "Employee created")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public EmployeeResponse create(@Valid @RequestBody EmployeeRequest request) {
        return employeeService.create(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing employee")
    @ApiResponse(responseCode = "200", description = "Employee updated")
    @ApiResponse(responseCode = "404", description = "Employee not found")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public EmployeeResponse update(@PathVariable Long id, @Valid @RequestBody EmployeeRequest request) {
        return employeeService.update(id, request);
    }
}

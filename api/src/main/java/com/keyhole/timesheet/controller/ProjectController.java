package com.keyhole.timesheet.controller;

import com.keyhole.timesheet.dto.ProjectRequest;
import com.keyhole.timesheet.dto.ProjectResponse;
import com.keyhole.timesheet.service.ProjectService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
@Tag(name = "Projects", description = "Project management endpoints")
public class ProjectController {

    private final ProjectService projectService;

    @GetMapping
    @Operation(summary = "Get all projects, optionally filtered by active status")
    public List<ProjectResponse> getAll(@RequestParam(required = false) Boolean active) {
        return projectService.findAll(active);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get project by ID")
    @ApiResponse(responseCode = "200", description = "Project found")
    @ApiResponse(responseCode = "404", description = "Project not found")
    public ProjectResponse getById(@PathVariable Long id) {
        return projectService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new project")
    @ApiResponse(responseCode = "201", description = "Project created")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ProjectResponse create(@Valid @RequestBody ProjectRequest request) {
        return projectService.create(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing project")
    @ApiResponse(responseCode = "200", description = "Project updated")
    @ApiResponse(responseCode = "404", description = "Project not found")
    @ApiResponse(responseCode = "400", description = "Invalid input")
    public ProjectResponse update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
        return projectService.update(id, request);
    }
}

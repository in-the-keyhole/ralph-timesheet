package com.keyhole.timesheet.service;

import com.keyhole.timesheet.dto.ProjectRequest;
import com.keyhole.timesheet.dto.ProjectResponse;
import com.keyhole.timesheet.entity.Project;
import com.keyhole.timesheet.exception.ResourceNotFoundException;
import com.keyhole.timesheet.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public List<ProjectResponse> findAll(Boolean active) {
        List<Project> projects = (active != null)
                ? projectRepository.findByActive(active)
                : projectRepository.findAll();
        return projects.stream().map(this::toResponse).toList();
    }

    public ProjectResponse findById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return toResponse(project);
    }

    public ProjectResponse create(ProjectRequest request) {
        Project project = Project.builder()
                .name(request.getName())
                .code(request.getCode())
                .description(request.getDescription())
                .active(request.getActive())
                .build();
        return toResponse(projectRepository.save(project));
    }

    public ProjectResponse update(Long id, ProjectRequest request) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        project.setName(request.getName());
        project.setCode(request.getCode());
        project.setDescription(request.getDescription());
        project.setActive(request.getActive());
        return toResponse(projectRepository.save(project));
    }

    private ProjectResponse toResponse(Project project) {
        return ProjectResponse.builder()
                .id(project.getId())
                .name(project.getName())
                .code(project.getCode())
                .description(project.getDescription())
                .active(project.getActive())
                .build();
    }
}

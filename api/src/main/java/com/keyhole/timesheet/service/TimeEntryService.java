package com.keyhole.timesheet.service;

import com.keyhole.timesheet.dto.TimeEntryRequest;
import com.keyhole.timesheet.dto.TimeEntryResponse;
import com.keyhole.timesheet.entity.Employee;
import com.keyhole.timesheet.entity.Project;
import com.keyhole.timesheet.entity.TimeEntry;
import com.keyhole.timesheet.exception.ResourceNotFoundException;
import com.keyhole.timesheet.repository.EmployeeRepository;
import com.keyhole.timesheet.repository.ProjectRepository;
import com.keyhole.timesheet.repository.TimeEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimeEntryService {

    private final TimeEntryRepository timeEntryRepository;
    private final EmployeeRepository employeeRepository;
    private final ProjectRepository projectRepository;

    public List<TimeEntryResponse> findAll(Long employeeId, Long projectId, LocalDate startDate, LocalDate endDate) {
        List<TimeEntry> entries;
        if (employeeId != null && startDate != null && endDate != null) {
            entries = timeEntryRepository.findByEmployeeIdAndDateBetween(employeeId, startDate, endDate);
        } else if (employeeId != null) {
            entries = timeEntryRepository.findByEmployeeId(employeeId);
        } else if (projectId != null) {
            entries = timeEntryRepository.findByProjectId(projectId);
        } else {
            entries = timeEntryRepository.findAll();
        }
        return entries.stream().map(this::toResponse).toList();
    }

    public TimeEntryResponse findById(Long id) {
        TimeEntry entry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Time entry not found with id: " + id));
        return toResponse(entry);
    }

    public TimeEntryResponse create(TimeEntryRequest request) {
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + request.getEmployeeId()));
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        TimeEntry entry = TimeEntry.builder()
                .employee(employee)
                .project(project)
                .date(request.getDate())
                .hours(request.getHours())
                .description(request.getDescription())
                .build();
        return toResponse(timeEntryRepository.save(entry));
    }

    public TimeEntryResponse update(Long id, TimeEntryRequest request) {
        TimeEntry entry = timeEntryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Time entry not found with id: " + id));
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + request.getEmployeeId()));
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + request.getProjectId()));

        entry.setEmployee(employee);
        entry.setProject(project);
        entry.setDate(request.getDate());
        entry.setHours(request.getHours());
        entry.setDescription(request.getDescription());
        return toResponse(timeEntryRepository.save(entry));
    }

    public void delete(Long id) {
        if (!timeEntryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Time entry not found with id: " + id);
        }
        timeEntryRepository.deleteById(id);
    }

    private TimeEntryResponse toResponse(TimeEntry entry) {
        return TimeEntryResponse.builder()
                .id(entry.getId())
                .employeeId(entry.getEmployee().getId())
                .employeeName(entry.getEmployee().getFirstName() + " " + entry.getEmployee().getLastName())
                .projectId(entry.getProject().getId())
                .projectName(entry.getProject().getName())
                .date(entry.getDate())
                .hours(entry.getHours())
                .description(entry.getDescription())
                .build();
    }
}

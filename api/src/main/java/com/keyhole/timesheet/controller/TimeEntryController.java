package com.keyhole.timesheet.controller;

import com.keyhole.timesheet.dto.TimeEntryRequest;
import com.keyhole.timesheet.dto.TimeEntryResponse;
import com.keyhole.timesheet.service.TimeEntryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1/time-entries")
@RequiredArgsConstructor
public class TimeEntryController {

    private final TimeEntryService timeEntryService;

    @GetMapping
    public List<TimeEntryResponse> getAll(
            @RequestParam(required = false) Long employeeId,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return timeEntryService.findAll(employeeId, projectId, startDate, endDate);
    }

    @GetMapping("/{id}")
    public TimeEntryResponse getById(@PathVariable Long id) {
        return timeEntryService.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TimeEntryResponse create(@Valid @RequestBody TimeEntryRequest request) {
        return timeEntryService.create(request);
    }

    @PutMapping("/{id}")
    public TimeEntryResponse update(@PathVariable Long id, @Valid @RequestBody TimeEntryRequest request) {
        return timeEntryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        timeEntryService.delete(id);
    }
}

package com.keyhole.timesheet.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.keyhole.timesheet.dto.TimeEntryRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class TimeEntryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldGetAllTimeEntries() throws Exception {
        mockMvc.perform(get("/api/v1/time-entries"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(4))));
    }

    @Test
    void shouldFilterByEmployeeId() throws Exception {
        mockMvc.perform(get("/api/v1/time-entries").param("employeeId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void shouldFilterByDateRange() throws Exception {
        mockMvc.perform(get("/api/v1/time-entries")
                        .param("employeeId", "1")
                        .param("startDate", "2025-01-06")
                        .param("endDate", "2025-01-06"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));
    }

    @Test
    void shouldGetTimeEntryById() throws Exception {
        mockMvc.perform(get("/api/v1/time-entries/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.employeeName").value("John Doe"))
                .andExpect(jsonPath("$.hours").value(8.0));
    }

    @Test
    void shouldReturn404ForNonExistentEntry() throws Exception {
        mockMvc.perform(get("/api/v1/time-entries/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreateTimeEntry() throws Exception {
        TimeEntryRequest request = TimeEntryRequest.builder()
                .employeeId(1L)
                .projectId(1L)
                .date(LocalDate.of(2025, 1, 8))
                .hours(new BigDecimal("4.00"))
                .description("Testing")
                .build();

        mockMvc.perform(post("/api/v1/time-entries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.hours").value(4.0));
    }

    @Test
    void shouldReturn400ForInvalidTimeEntry() throws Exception {
        TimeEntryRequest request = TimeEntryRequest.builder().build();

        mockMvc.perform(post("/api/v1/time-entries")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldUpdateTimeEntry() throws Exception {
        TimeEntryRequest request = TimeEntryRequest.builder()
                .employeeId(1L)
                .projectId(1L)
                .date(LocalDate.of(2025, 1, 6))
                .hours(new BigDecimal("6.00"))
                .description("Updated")
                .build();

        mockMvc.perform(put("/api/v1/time-entries/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hours").value(6.0))
                .andExpect(jsonPath("$.description").value("Updated"));
    }

    @Test
    void shouldDeleteTimeEntry() throws Exception {
        mockMvc.perform(delete("/api/v1/time-entries/1"))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/time-entries/1"))
                .andExpect(status().isNotFound());
    }
}

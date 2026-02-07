package com.keyhole.timesheet.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.keyhole.timesheet.dto.ProjectRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void shouldGetAllProjects() throws Exception {
        mockMvc.perform(get("/api/v1/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))));
    }

    @Test
    void shouldFilterActiveProjects() throws Exception {
        mockMvc.perform(get("/api/v1/projects").param("active", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    void shouldGetProjectById() throws Exception {
        mockMvc.perform(get("/api/v1/projects/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Timesheet App"))
                .andExpect(jsonPath("$.code").value("TSA"));
    }

    @Test
    void shouldReturn404ForNonExistentProject() throws Exception {
        mockMvc.perform(get("/api/v1/projects/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void shouldCreateProject() throws Exception {
        ProjectRequest request = ProjectRequest.builder()
                .name("New Project")
                .code("NPJ")
                .description("A new project")
                .active(true)
                .build();

        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.name").value("New Project"));
    }

    @Test
    void shouldReturn400ForInvalidProject() throws Exception {
        ProjectRequest request = ProjectRequest.builder()
                .name("")
                .code("")
                .build();

        mockMvc.perform(post("/api/v1/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void shouldUpdateProject() throws Exception {
        ProjectRequest request = ProjectRequest.builder()
                .name("Timesheet App Updated")
                .code("TSA")
                .description("Updated description")
                .active(true)
                .build();

        mockMvc.perform(put("/api/v1/projects/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Timesheet App Updated"));
    }
}

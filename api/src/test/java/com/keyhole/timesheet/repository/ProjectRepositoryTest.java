package com.keyhole.timesheet.repository;

import com.keyhole.timesheet.entity.Project;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ProjectRepositoryTest {

    @Autowired
    private ProjectRepository projectRepository;

    @Test
    void shouldLoadSeedData() {
        List<Project> projects = projectRepository.findAll();
        assertThat(projects).hasSize(3);
    }

    @Test
    void shouldFindActiveProjects() {
        List<Project> activeProjects = projectRepository.findByActive(true);
        assertThat(activeProjects).hasSize(2);
    }

    @Test
    void shouldFindInactiveProjects() {
        List<Project> inactiveProjects = projectRepository.findByActive(false);
        assertThat(inactiveProjects).hasSize(1);
        assertThat(inactiveProjects.get(0).getCode()).isEqualTo("LGM");
    }

    @Test
    void shouldSaveNewProject() {
        Project project = Project.builder()
                .name("New Project")
                .code("NPJ")
                .description("A new test project")
                .active(true)
                .build();

        Project saved = projectRepository.save(project);

        assertThat(saved.getId()).isNotNull();
        assertThat(projectRepository.findAll()).hasSize(4);
    }
}

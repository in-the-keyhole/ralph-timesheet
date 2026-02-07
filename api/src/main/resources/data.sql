-- Seed employees
INSERT INTO employees (first_name, last_name, email, department) VALUES ('John', 'Doe', 'john.doe@keyhole.com', 'Engineering');
INSERT INTO employees (first_name, last_name, email, department) VALUES ('Jane', 'Smith', 'jane.smith@keyhole.com', 'Design');
INSERT INTO employees (first_name, last_name, email, department) VALUES ('Bob', 'Johnson', 'bob.johnson@keyhole.com', 'Engineering');

-- Seed projects
INSERT INTO projects (name, code, description, active) VALUES ('Timesheet App', 'TSA', 'Internal timesheet tracking application', true);
INSERT INTO projects (name, code, description, active) VALUES ('Client Portal', 'CPT', 'Customer-facing portal project', true);
INSERT INTO projects (name, code, description, active) VALUES ('Legacy Migration', 'LGM', 'Migrating legacy systems to cloud', false);

-- Seed time entries
INSERT INTO time_entries (employee_id, project_id, date, hours, description) VALUES (1, 1, '2025-01-06', 8.00, 'Backend API development');
INSERT INTO time_entries (employee_id, project_id, date, hours, description) VALUES (1, 2, '2025-01-07', 4.00, 'Portal design review');
INSERT INTO time_entries (employee_id, project_id, date, hours, description) VALUES (2, 1, '2025-01-06', 6.50, 'UI wireframes');
INSERT INTO time_entries (employee_id, project_id, date, hours, description) VALUES (3, 3, '2025-01-06', 7.75, 'Data migration scripts');

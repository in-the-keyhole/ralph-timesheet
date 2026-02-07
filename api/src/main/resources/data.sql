-- Seed employees
INSERT INTO employees (first_name, last_name, email, department) VALUES ('John', 'Doe', 'john.doe@keyhole.com', 'Engineering');
INSERT INTO employees (first_name, last_name, email, department) VALUES ('Jane', 'Smith', 'jane.smith@keyhole.com', 'Design');
INSERT INTO employees (first_name, last_name, email, department) VALUES ('Bob', 'Johnson', 'bob.johnson@keyhole.com', 'Engineering');

-- Seed projects
INSERT INTO projects (name, code, description, active) VALUES ('Timesheet App', 'TSA', 'Internal timesheet tracking application', true);
INSERT INTO projects (name, code, description, active) VALUES ('Client Portal', 'CPT', 'Customer-facing portal project', true);
INSERT INTO projects (name, code, description, active) VALUES ('Legacy Migration', 'LGM', 'Migrating legacy systems to cloud', false);

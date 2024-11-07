CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE emp_role AS ENUM ('OFFICE', 'REMOTE', 'FIELD', 'REPAIR', 'MANAGER');
CREATE TYPE employ_type AS ENUM ('FULLTIME', 'PARTTIME');
CREATE TYPE ProjectStatus AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED', 'ON HOLD');
CREATE TYPE ProjectHealth AS ENUM ('On Track', 'At Risk', 'Off Track');
CREATE TYPE ProjectPhase AS ENUM ('Plan & Prepare', 'Build & Manage', 'Close & Sustain', 'Completed');
CREATE TYPE taskStatus AS ENUM ('NEW', 'IN-PROGRESS', 'TESTING', 'COMPLETED');
CREATE TYPE admin_type AS ENUM ('ADMIN', 'SUPERADMIN');

CREATE TABLE administrator (
    admin_id uuid DEFAULT uuid_generate_v4() UNIQUE,
    first_name varchar(255) NOT NULL, -- first name
    last_name varchar(255) NOT NULL, -- last name
    username varchar(255) NOT NULL, -- username
    password varchar(255) NOT NULL, -- password
    administrator_type admin_type NOT NULL, -- admin type can be either ADMIN or SUPERADMIN
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
    PRIMARY KEY(username)
);

CREATE TABLE company (
  name VARCHAR(255) NOT NULL UNIQUE PRIMARY KEY, -- Every company needs a unique name
  phone VARCHAR(15),
  email VARCHAR(255),
  description TEXT,
  address1 VARCHAR(255) NOT NULL,
  address2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  state VARCHAR(3) NOT NULL,
  country CHAR(2) NOT NULL,
  postalcode VARCHAR(16) NOT NULL,
  timezone VARCHAR(32) NOT NULL,
  clockOutCronExpression VARCHAR(32) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE TABLE employee (
    emp_id uuid DEFAULT uuid_generate_v4() UNIQUE, -- Used to better reference employee records
    manager_id uuid, -- References this employees manager if they have one
    company_name varchar(255),
    first_name varchar(255) NOT NULL, -- first name
    last_name varchar(255) NOT NULL, -- last name
    username varchar(255) NOT NULL, -- username
    password varchar(255) NOT NULL, -- password
    roles emp_role[] NOT NULL, -- Uses an enum for the emp type
    employment_type employ_type NOT NULL, -- uses an enum for employment type
    breaks_remaining Integer,
    break_duration Integer,
    FOREIGN KEY (company_name) REFERENCES company,
    FOREIGN KEY (manager_id) REFERENCES employee(emp_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
    PRIMARY KEY(username, company_name) -- Every employee must have a unique pair of username and company name
);

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    name varchar(255) NOT NULL,
    description varchar(255),
    company_name varchar(255),
    start_date DATE NOT NULL,
    estimated_end_date DATE,
    actual_end_date DATE,
    status ProjectStatus,
    health ProjectHealth,
    phase ProjectPhase,
    assigned_employees uuid[],
    FOREIGN KEY (company_name) REFERENCES company,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE task (
    task_id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    name varchar(255) NOT NULL,
    description text,
    start_date DATE NOT NULL,
    end_date DATE,
    status TaskStatus,
    assigned_employee uuid,
    FOREIGN KEY (project_id) REFERENCES project (project_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE timesheet (
	timesheet_id serial PRIMARY KEY,
	emp_id uuid, --references an employee
	clock_date DATE NOT NULL, -- date of the clock in cannot be null
	clock_in_time TIME NOT NULL, -- clock in cannot be null
	clock_out_time TIME, -- clock out can be null. we are waiting on the emp to clock out after theyve clocked in
	location varchar(255), -- nullable
	project_id int,
	clock_in_location POINT,
    clock_out_location POINT,
	clock_in_region BOOLEAN,
    clock_out_region BOOLEAN,
    is_approved BOOLEAN,
	FOREIGN KEY (project_id) REFERENCES project,
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE break (
	timesheet_id int,
 	break_length int NOT NULL,
 	start_time TIME NOT NULL,
	end_time TIME,
	FOREIGN KEY (timesheet_id) REFERENCES timesheet(timesheet_id),
	created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- This table creates records everytime an employee gets assigned to a specific project
CREATE TABLE ProjectTimeTracking (
    tracking_id SERIAL PRIMARY KEY,
    employee_id uuid REFERENCES Employee(emp_id),
    project_id INT REFERENCES Project(project_id),
    total_time_spent INTERVAL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- This table creates records added everytime an employee gets assigned to a specific task
CREATE TABLE TaskTimeTracking (
    tracking_id SERIAL PRIMARY KEY,
    employee_id uuid REFERENCES Employee(emp_id),
    task_id INT REFERENCES Task(task_id),
    project_time_tracking_id INT REFERENCES ProjectTimeTracking(tracking_id),
    time_spent INTERVAL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- This table gets records added everytime an employee starts tracking time.
-- Before adding new record, backend should check that none of the current Events are in progress for a given employee task pair.
-- Employee has to stop time before a new Event can be created.
CREATE TABLE TaskTimeEvent (
    event_id SERIAL PRIMARY KEY,
    employee_id uuid REFERENCES Employee(emp_id),
    task_id INT REFERENCES Task(task_id),
    tracking_id INT REFERENCES TaskTimeTracking(tracking_id),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    stop_time TIMESTAMP,
    in_progress BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE Geofence (
    geofence_id SERIAL PRIMARY KEY,
    employee_id uuid REFERENCES Employee(emp_id),
    geolocation POINT NOT NULL,
    radius INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Project Trigger Function: Automatically calculates the total time spent on a project based on sum of time spent on tasks
CREATE OR REPLACE FUNCTION update_employee_project_time()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ProjectTimeTracking AS ptt
    SET total_time_spent = (
        SELECT COALESCE(SUM(time_spent), '00:00:00'::interval)
        FROM TaskTimeTracking
        WHERE project_time_tracking_id = NEW.project_time_tracking_id
    )
    WHERE tracking_id = NEW.project_time_tracking_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Task Trigger Function: Automatically calculates the amount of time spent in a TaskTimeEvent and updates TaskTimeTracking
CREATE OR REPLACE FUNCTION update_employee_task_time()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE TaskTimeTracking
    SET time_spent = (
        SELECT COALESCE(SUM(extract(epoch from (tte.stop_time AT TIME ZONE 'UTC' - tte.start_time AT TIME ZONE 'UTC')) * INTERVAL '1 second'), '0 seconds'::interval)
        FROM TaskTimeEvent tte
        WHERE
            tte.task_id = NEW.task_id
            AND tte.employee_id = NEW.employee_id
            AND tte.start_time < tte.stop_time  -- To consider only future start events
    )
    WHERE
        TaskTimeTracking.task_id = NEW.task_id
        AND TaskTimeTracking.employee_id = NEW.employee_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Project Trigger: Fires everytime  TaskTimeTracking gets added/updated
CREATE TRIGGER update_employee_project_time_trigger
AFTER INSERT OR UPDATE OR DELETE ON TaskTimeTracking
FOR EACH ROW
EXECUTE FUNCTION update_employee_project_time();

-- Task Trigger: Fires everytime TaskTimeEvents get added/updated
CREATE TRIGGER update_employee_task_time_trigger
AFTER INSERT OR UPDATE OR DELETE ON TaskTimeEvent
FOR EACH ROW
EXECUTE FUNCTION update_employee_task_time();

INSERT INTO administrator
VALUES
    (DEFAULT, 'Wes', 'Montgomery', 'superadmin1', 'super', 'SUPERADMIN'),
    (DEFAULT, 'Jaco', 'Pastorius', 'admin1', 'admin', 'ADMIN');

INSERT INTO company
VALUES
      (
        'Google', '123-456-7890', 'google@google.com', 'Google Enterprises',
        '1600 Amphitheatre Pkwy','','Mountain View', 'CA', 'US', '94043'
      ),
      (
        'Apple', '456-123-7890', 'apple@apple.com', 'Apple Enterprises',
        '1 Apple Park Way','','Cupertino', 'CA', 'US', '95014'
      ),
      (
        'Microsoft', '123-123-7890', 'microsoft@microsoft.com', 'Microsoft Enterprises',
        '16255 NE 36th Way','','Redmond', 'WA', 'US', '98052'
      )
    ;

INSERT INTO employee
VALUES
    (DEFAULT, null, 'Google', 'Frank', 'Johnson', 'log1', 'pw1', '{MANAGER, OFFICE}', 'FULLTIME');

-- The following snippet simulates a manager adding employees tying to the manager's UUID
do $$
declare
   ManagerID uuid;
begin
    SELECT emp_id
    into ManagerID
    FROM employee
    WHERE first_name = 'Frank';

    INSERT INTO employee
    VALUES
        (DEFAULT, ManagerID, 'Google', 'Joe', 'Shmoe', 'log2', 'pw2', '{REMOTE}', 'FULLTIME'),
        (DEFAULT, ManagerID, 'Google', 'Bob', 'Jamerson', 'log3', 'pw3', '{FIELD}', 'PARTTIME'),
        (DEFAULT, ManagerID, 'Google', 'James', 'McCartney', 'log4', 'pw4', '{REPAIR}', 'FULLTIME'),
        (DEFAULT, ManagerID, 'Google', 'David', 'Daniels', 'log5', 'pw5', '{OFFICE}', 'FULLTIME'),
        (DEFAULT, ManagerID, 'Google', 'John', 'Doe', 'log6', 'pw6', '{OFFICE, REMOTE}', 'FULLTIME');
end; $$;

INSERT INTO project
VALUES
(DEFAULT, 'Project1', 'Test Project Description 1', 'Google', '2023-11-1', '2023-12-1',null,'ACTIVE', 'On Track', 'Plan & Prepare',null),
(DEFAULT, 'Project2', 'Test Project Description 2', 'Apple', '2023-11-1', '2023-12-1',null,'COMPLETED', 'On Track', 'Completed',null),
(DEFAULT, 'Project3', 'Test Project Description 3', 'Microsoft', '2023-11-1', '2023-12-1',null,'ON HOLD', 'At Risk', 'Build & Manage',null),
(DEFAULT, 'Project4', 'Test Project Description 3', 'Google', '2023-11-1', '2023-12-1',null,'CANCELLED', 'Off Track', 'Close & Sustain',null)
;

-- adds tasks to project of ID = 2.
INSERT INTO task VALUES
(DEFAULT, 2, 'task-1-create-task-table', 'create a table for tasks in sql', CURRENT_DATE, null, 'NEW', null),
(DEFAULT, 2, 'task-2-another-task', 'another task description', CURRENT_DATE, null, 'NEW', null),
(DEFAULT, 2, 'task-3-another-task', 'another task description for task 3', CURRENT_DATE, null, 'IN-PROGRESS', null),
(DEFAULT, 2, 'task-5-another-task', 'another task description for task 5', CURRENT_DATE, null, 'COMPLETED', null),
(DEFAULT, 2, 'task-6-another-task', 'another task description for task 6', CURRENT_DATE, null, 'TESTING', null);


INSERT INTO timesheet
VALUES
(DEFAULT, 'log1', 'Google', '2023-10-16', '10:00', '17:00', NULL, NULL),
(DEFAULT, 'log1', 'Google', '2023-10-15', '11:00', '15:00', NULL, NULL),
(DEFAULT, 'log1', 'Google', '2023-10-14', '12:00', '16:00', NULL, NULL),
(DEFAULT, 'log1', 'Google', '2023-10-13', '13:00', '18:00', NULL, NULL),
(DEFAULT, 'log2', 'Google', '2023-10-15', '12:00', '20:00', NULL, NULL),
(DEFAULT, 'log2', 'Google', '2023-10-14', '12:00', '17:00', NULL, NULL),
(DEFAULT, 'log2', 'Google', '2023-10-13', '12:00', '16:00', NULL, NULL),
(DEFAULT, 'log3', 'Google', '2023-10-14', '13:00', '14:00', NULL, NULL),
(DEFAULT, 'log3', 'Google', '2023-10-13', '13:00', '17:00', NULL, NULL),
(DEFAULT, 'log3', 'Google', '2023-10-12', '13:00', '17:00', NULL, NULL),
(DEFAULT, 'log4', 'Google', '2023-10-12', '14:00', '17:00', NULL, NULL),
(DEFAULT, 'log4', 'Google', '2023-10-11', '12:00', '17:00', NULL, NULL),
(DEFAULT, 'log4', 'Google', '2023-10-10', '13:00', '17:00', NULL, NULL),
(DEFAULT, 'log5', 'Google', '2023-10-11', '08:00', '17:00', NULL, NULL);

INSERT INTO break
VALUES
(1, 30, '13:00', '13:30'),
(4, 30, '14:00', '14:30'),
(5, 30, '10:00', '10:30'),
(6, 60, '13:00', '14:00'),
(7, 60, '12:00', '13:00'),
(9, 60, '12:00', '13:00'),
(10, 60, '12:00', '13:00'),
(12, 60, '12:00', '13:00'),
(14, 60, '12:00', '13:00');

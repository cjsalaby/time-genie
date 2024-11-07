-- This table creates records everytime an employee gets assigned to a specific project
CREATE TABLE ProjectTimeTracking (
    tracking_id SERIAL PRIMARY KEY,
    employee_id uuid REFERENCES Employee(emp_id),
    project_id INT REFERENCES Project(project_id),
    total_time_spent INT,
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
    time_spent INT,
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

-- Project Trigger Function: Automatically calculates the total time spent on a project based on sum of time spent on tasks
CREATE OR REPLACE FUNCTION update_employee_project_time()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE ProjectTimeTracking AS ptt
    SET total_time_spent = (
        SELECT COALESCE(SUM(time_spent))
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
        SELECT COALESCE(SUM(extract(epoch from (tte.stop_time AT TIME ZONE 'UTC' - tte.start_time AT TIME ZONE 'UTC'))))
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


-- Example date for TaskTimeTracking. Employees need to be already assigned to a project.
INSERT INTO ProjectTimeTracking (employee_id, project_id)
VALUES
    ('60e74076-feb7-4137-9af9-7fb4a1fcae1c', 12),  -- Employee 1 assigned to project 12
    ('9dd61652-24b8-4afe-93f1-f9673387ff65', 12);   -- Employee 2 assigned to project 12

-- Example date for TaskTimeTracking. Employees need to already assigned to the task.
INSERT INTO TaskTimeTracking (employee_id, task_id, project_time_tracking_id)
VALUES
    ('60e74076-feb7-4137-9af9-7fb4a1fcae1c', 38, 1),  -- Employee 1 assigned to task 38
    ('9dd61652-24b8-4afe-93f1-f9673387ff65', 39, 2),   -- Employee 2 assigned to task 39
    ('60e74076-feb7-4137-9af9-7fb4a1fcae1c', 39, 1);  -- Employee 1 assigned to task 39

-- Example data for TaskTimeEvent (You might need to adjust in order to match your employees and tasks)
INSERT INTO TaskTimeEvent (tracking_id, employee_id, task_id, start_time, stop_time)
VALUES
    (1, '60e74076-feb7-4137-9af9-7fb4a1fcae1c', 38, '2024-01-31 08:00:00', '2024-01-31 14:00:00'), -- Employee 1 started Task 1 at 8:00 AM, stopped at 2:00 PM (6 hours logged)
    (2, '9dd61652-24b8-4afe-93f1-f9673387ff65', 39, '2024-01-31 09:30:00', '2024-01-31 10:30:00'), -- Employee 2 started Task 2 at 9:30 AM, stopped at 10:30 AM (1 hour logged)
    (3, '60e74076-feb7-4137-9af9-7fb4a1fcae1c', 39, '2024-01-31 11:00:00', '2024-01-31 14:00:00'), -- Employee 1 started Task 2 at 11:00 AM, stopped at 2:00 PM (3 hours logged)
    (1, '60e74076-feb7-4137-9af9-7fb4a1fcae1c', 38, '2024-02-01 08:00:00', '2024-02-01 10:00:00'); -- Employee 1 on the next day started Task 1 at 8:00 AM, stopped at 10:00 AM (2 hours added to logging)

/*
DATE SHOULD LOOK SIMILAR TO THE FOLLOWING:

SELECT * from TaskTimeTracking;

 tracking_id |             employee_id              | task_id | time_spent |         created_at         |         updated_at
-------------+--------------------------------------+---------+------------+----------------------------+----------------------------
           2 | 9dd61652-24b8-4afe-93f1-f9673387ff65 |      39 | 01:00:00   | 2024-02-01 02:48:49.784778 | 2024-02-01 02:48:49.784778
           3 | 60e74076-feb7-4137-9af9-7fb4a1fcae1c |      39 | 03:00:00   | 2024-02-01 02:48:49.784778 | 2024-02-01 02:48:49.784778
           1 | 60e74076-feb7-4137-9af9-7fb4a1fcae1c |      38 | 08:00:00   | 2024-02-01 02:48:49.784778 | 2024-02-01 02:48:49.784778

 SELECT * FROM ProjectTimeTracking;
 tracking_id |             employee_id              | project_id | total_time_spent |         created_at         |         updated_at
-------------+--------------------------------------+------------+------------------+----------------------------+----------------------------
           2 | 9dd61652-24b8-4afe-93f1-f9673387ff65 |         12 | 01:00:00         | 2024-02-01 10:35:24.586268 | 2024-02-01 10:35:24.586268
           1 | 60e74076-feb7-4137-9af9-7fb4a1fcae1c |         12 | 11:00:00         | 2024-02-01 10:35:24.586268 | 2024-02-01 10:35:24.586268

*/

CREATE TABLE breaks (
    break_id SERIAL PRIMARY KEY,
    employee_id uuid REFERENCES Employee(emp_id),
    start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    stop_time TIMESTAMP ,
    total_time_spent INT,
    in_progress BOOLEAN DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_employee_break_time()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE breaks 
    SET total_time_spent = (
        SELECT COALESCE(SUM(extract(epoch from (stop_time AT TIME ZONE 'UTC' - start_time AT TIME ZONE 'UTC'))))
        FROM breaks
        WHERE break_id = NEW.break_id
    )
    WHERE break_id = NEW.break_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE TRIGGER update_employee_break_time_trigger
AFTER UPDATE ON breaks
FOR EACH ROW
WHEN (pg_trigger_depth() < 1) 
EXECUTE FUNCTION update_employee_break_time();


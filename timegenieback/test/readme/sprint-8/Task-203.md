# How to run Task 203
Login as a manager

Some setup/additional notes: 
- Assign an employee to a new project
- Assign an employee to a new task created under that project
- No endpoints exist for creating the Project and Task tracking records because backend handles creating them when employee gets assigned
- Managers can use this functionality if they assign themselves to a task.

Start tracking time for a specific task
```
Method: POST
URL: http://localhost:3000/api/timetracking
BODY:
{
    "task_id":<INTEGER>
}
```

Stop tracking time for a specific task
```
Method: PATCH
URL: http://localhost:3000/api/timetracking
BODY:
{
    "task_id":<INTEGER>
}
```

Gets the total time spent for a specific project
```
Method: GET
URL: http://localhost:3000/api/timetracking/project?project_id=<INTEGER>
```

Gets the total time spent for a specific task
```
Method: GET
URL: http://localhost:3000/api/timetracking/task?task_id=<INTEGER>
```

Gets all the time events for a specific project
```
Method: GET
URL: http://localhost:3000/api/timetracking/project/events?project_id=<INTEGER>
```

Gets all the time events for a specific task
```
Method: GET
URL: http://localhost:3000/api/timetracking/task/events?task_id=<INTEGER>
```
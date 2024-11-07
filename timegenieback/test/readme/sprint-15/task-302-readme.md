# Running Task 302 Backend

## Setup
1. Run the migrations file to update the database
   1. `npx sequelize-cli db:migrate --name 20240325005715-create-timechangerequest.js`


## Postman Calls

1. Get TimeChangeRequests for current employee (requires bearer token)

`GET http://localhost:3000/api/timechange`

2. Get TimeChangeRequests for all employees under a manager (requires bearer token with manager role)

`GET http://localhost:3000/api/timechange/all`

3. Create a TimeChangeRequest. (timesheet_id must reference a timesheet that is owned by the employee making the POST request)

`POST http://localhost:3000/api/timechange`
```
{
    "timesheet_id":23,
    "description": "This is a test description"
}
```

4. Approve/Deny a TimeChangeRequest. (requires bearer token with manager role, 
   and id must reference a TimeChangeRequest that was made by an employee under the manager making the PATCH)

`PATCH http://localhost:3000/api/timechange`
```
{
    "id":6,
    "approval": true
}
```

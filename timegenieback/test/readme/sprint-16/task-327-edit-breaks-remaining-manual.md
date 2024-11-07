# Running Task 327 Backend

## Postman Calls


1. Edit remaining breaks for an employee. (requires bearer token with manager role,
   emp_id must reference an employee exists under the manager making the PATCH)

`PATCH` http://localhost:3000/api/break/remaining
```
{
    "emp_id": "60e74076-feb7-4137-9af9-7fb4a1fcae1c",
    "breaks_remaining": "2"
}
```

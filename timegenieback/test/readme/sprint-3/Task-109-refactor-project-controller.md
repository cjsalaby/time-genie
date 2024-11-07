# timegenieback

How to run:
Using Postman

This goes over some refactoring and authorization:

1. Firstly you need to login to the system, our databases may differ but you need an employee with role: MANAGER
   method: POST
   URL: http://localhost:3000/app/login

   {
   "username": "log1",
   "company_name": "Google",
   "password": "pw1"
   }

   You should receive back a message similar to this:

   {
   "success": true,
   "message": "Welcome back log1",
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxvZzEiLCJpYXQiOjE2OTkzNDYwMTksImV4cCI6MTY5OTM0OTYxOX0.xLqlF1lhqLuWCoXzgbkkXATP3ylAI1WEvK_VtRFsUDA"
   }

   Now you will need that token, copy it from YOUR postman.

2. Now you can query a project, if you were to try to create an employee without logging in you would get an authorized message.
    - Before you send the request firstly open the Authorization tab
    - In the Type field select Bearer Token
    - In the box to the right paste you token

   method: GET
   URL: http://localhost:3000/app/project?project_id=2

   Now send the request, you should receive back the information of this new project.

3. Getting all projects you still need to use that authorization token.
   Do the same as before and paste the token in the Authorization tab. 
   This uses the logged in user's company to only show the projects from that company.

   method: GET
   URL: http://localhost:3000/app/project/all

   Now you can send the request, you should receive back all projects from that manager's company.

4. Once again use the same token that was generated at the beginning when you logged in.
   Paste the token in the authorization tab before you send the request.

   method: PUT
   URL: http://localhost:3000/app/project

   {
       "name": "New Apple Project",
       "description": "This is a new project for Apple",
       "company_name": "Apple"
   }

   You should receive back a message that has all the fields of the new project.


5. Logging in as an employee, as an employee you have a limited amount of things you can do, if you were to try
   to create, update or delete an employee your requests would be denied.

   method: PATCH
   URL: http://localhost:3000/app/project

    {
        "project_id": "6",
        "new_name": "Revised Apple Project",
        "new_description": "This is a Revised project for Apple",
        "new_status": "ON HOLD",
        "new_health": "At Risk",
        "new_phase": "Build & Manage"
    }

    You should receive back the project with the updated fields.









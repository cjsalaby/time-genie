# timegenieback

How to run:
Using Postman

This goes over some refactoring and authorization:

1. Firstly you need to login to the system, our databases may differ but you need an employee with role: MANAGER
   method: POST
   You likely will need to change the sql to the updated revised timesheet table that has emp_id
   URL: http://localhost:3000/app/login

   {
   "username": "log1",
   "company_name": "Google",
   "password": "pw1",
   "isManager": false
   }

   You should receive back a message similar to this:

   {
   "success": true,
   "message": "Welcome back Frank",
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxvZzEiLCJpYXQiOjE2OTkzNDYwMTksImV4cCI6MTY5OTM0OTYxOX0.xLqlF1lhqLuWCoXzgbkkXATP3ylAI1WEvK_VtRFsUDA"
   }

   Now you will need that token, copy it from YOUR postman.

2. now you can clock in with no query given
    - Before you send the request firstly open the Authorization tab
    - In the Type field select Bearer Token
    - In the box to the right paste you token

    method: post
   URL: http://localhost:3000/app/timesheet


   A created clock in or an error that you are already clocked in should appear

   3. now you can clock out with no query given

    method: patch
   URL: http://localhost:3000/app/timesheet


   An updated clock out or an error that you arent clocked in should appear

   3. You should also be able to get all your timesheets

    method: get
   URL: http://localhost:3000/app/timesheet


   An list of all clocks should be shown
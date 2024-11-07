# Timegeniefront

1. Add a `.env` file to the root directory with the content `API_URL:'http//localhost:<backend_port>'`
   Replace `<backend_port>` with the port number that your backend server is running on locally.
2. Run `npx expo start`
3. Open the app with the emulator of your choosing( `a`, `w`, `i`)
   Note, the token will not be saved with the web version. Expo-secure-storage only works with mobile platforms
4. Attempt to login with the following credentials

```
   {
       "username": "log1",
       "company_name": "Google",
       "password": "pw1"
   }
```

You should be forwarded to the homepage.

Logout and try again but exclude the company field

- You should receive a message: `Error: Company does not exist`

Logout and try again but exclude username or password

- You should receive a message: `Error: Incorrect username or password`
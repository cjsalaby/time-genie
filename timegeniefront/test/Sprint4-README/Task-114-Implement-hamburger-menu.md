# Timegeniefront

1. Install all required
2. npm install @react-navigation/drawer
3. npx expo install react-native-gesture-handler react-native-reanimated
4. npm install react-native-gesture-handler react-native-reanimated
5. if on ios you will likely need to use this npx pod-install ios
6. Run `npx expo start --reset-cache`
7. Open the app with the emulator of your choosing( `a`, `w`, `i`)
   Note, the token will not be saved with the web version. Expo-secure-storage only works with mobile platforms
8. Attempt to login with the following credentials

```
   {
       "username": "log1",
       "company_name": "Google",
       "password": "pw1"
   }
```

You should be forwarded to the homepage.

at top left there should be a menu for navigation
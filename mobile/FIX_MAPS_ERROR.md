# Fix React Native Maps Error

## Problem
`RNMapsAirModule could not be found` - This means react-native-maps native module is not properly linked.

## Solution

### Step 1: Stop the Development Server
Press `Ctrl+C` in the terminal running Expo

### Step 2: Prebuild (Required for Native Modules)
```powershell
cd mobile
npx expo prebuild --clean
```

This will:
- Generate native Android/iOS folders
- Link all native modules including react-native-maps
- Configure the project properly

### Step 3: Run on Android
```powershell
npx expo run:android
```

This will:
- Build the native app with maps module
- Install on your device/emulator
- Start the development server

## Why This Happens

React Native Maps is a **native module** that requires:
1. Native Android/iOS code to be generated
2. Proper linking in the native build
3. Rebuilding the app (not just reloading)

You cannot use native modules with `expo start` alone - you must use `expo run:android` or `expo run:ios`.

## Quick Commands

```powershell
# Full rebuild
cd mobile
npx expo prebuild --clean
npx expo run:android

# If you get errors, try:
cd android
./gradlew clean
cd ..
npx expo run:android
```

## Alternative: Remove Maps Temporarily

If you want to test the app without maps:

1. Comment out map imports in screens:
   - `AmbulanceTracking.js`
   - `trackScreen.js`
   - `MapExample.js`

2. Replace MapView with a placeholder

But for production, you need to properly build with native modules.

## Important Notes

- `expo start` or `expo start --web` won't work with native modules
- You MUST use `expo run:android` or `expo run:ios`
- First build takes 5-10 minutes
- Subsequent builds are faster

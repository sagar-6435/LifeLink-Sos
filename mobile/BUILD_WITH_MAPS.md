# Building App with Maps - Complete Guide

## Current Status

✅ Maps are now **optional** - the app won't crash if maps aren't available
✅ Shows placeholder when maps module isn't built
✅ Full maps functionality when properly built

## Option 1: Run WITHOUT Maps (Quick Test)

The app will now work without crashing. Maps will show a placeholder.

```powershell
cd mobile
npx expo start --clear
```

Press `a` for Android or scan QR code.

## Option 2: Run WITH Maps (Full Features)

### Prerequisites
- Android Studio installed
- Android SDK configured
- Device/Emulator running

### Steps

**1. Clean everything:**
```powershell
cd mobile
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ios -ErrorAction SilentlyContinue
npm install
```

**2. Prebuild (generates native code):**
```powershell
npx expo prebuild --clean
```

This creates `android/` and `ios/` folders with native code.

**3. Build and run:**
```powershell
npx expo run:android
```

This will:
- Build the native Android app (5-10 minutes first time)
- Install on your device/emulator
- Start the development server
- Maps will work!

### Troubleshooting Build Issues

**If build fails:**
```powershell
cd android
.\gradlew clean
cd ..
npx expo run:android
```

**If still fails:**
```powershell
# Check Java version (needs Java 17)
java -version

# Check Android SDK
echo $env:ANDROID_HOME
```

**Gradle daemon issues:**
```powershell
cd android
.\gradlew --stop
cd ..
npx expo run:android
```

## Understanding the Difference

### `expo start` (Expo Go)
- ❌ Cannot use native modules like react-native-maps
- ✅ Fast reload
- ✅ No build required
- ✅ Good for testing UI/logic
- **Maps will show placeholder**

### `expo run:android` (Development Build)
- ✅ Full native module support
- ✅ Maps work perfectly
- ❌ Slower first build
- ✅ Fast subsequent builds
- **Required for production**

## What Changed

I made the maps **optional** so the app doesn't crash:

### AmbulanceTracking.js
- Conditionally imports maps
- Shows placeholder if maps unavailable
- Full functionality when built properly

### trackScreen.js
- Same conditional approach
- Graceful fallback to placeholder

## Production Build

For production APK with maps:

```powershell
cd mobile

# Build release APK
npx expo run:android --variant release

# Or use EAS Build
eas build -p android --profile production
```

## Quick Reference

| Command | Maps Work? | Build Time | Use Case |
|---------|-----------|------------|----------|
| `expo start` | ❌ (placeholder) | Instant | Quick testing |
| `expo run:android` | ✅ Full | 5-10 min first time | Development |
| `eas build` | ✅ Full | 10-20 min | Production |

## Recommendation

**For Development:**
1. Use `expo start` for quick UI testing
2. Use `expo run:android` when testing maps
3. Maps show helpful placeholder with instructions

**For Production:**
Always use `expo run:android` or `eas build` to include native modules.

## Need Help?

Check these files:
- `FIX_MAPS_ERROR.md` - Detailed troubleshooting
- `MAP_SETUP.md` - Maps configuration
- `QUICK_START_MAPS.md` - Quick start guide

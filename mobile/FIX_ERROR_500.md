# Fix Error 500 - Unable to Resolve Module

## Problem
The error occurs because the Metro bundler is trying to load deleted screen files (DoctorDashboard, PatientDashboard, etc.) that are cached.

## Quick Fix

### Option 1: Clear Cache (Recommended)

**On Windows (PowerShell):**
```powershell
cd mobile

# Stop any running metro bundler (Ctrl+C)

# Clear cache and restart
npx expo start --clear
```

**Or run the batch file:**
```powershell
cd mobile
.\clear-cache.bat
```

### Option 2: Manual Cache Clear

```powershell
cd mobile

# 1. Stop the development server (Ctrl+C)

# 2. Clear npm cache
npm cache clean --force

# 3. Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# 4. Start with cleared cache
npx expo start --clear
```

### Option 3: Reset Everything

```powershell
cd mobile

# Stop server
# Press Ctrl+C

# Remove all cache and build files
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .expo
Remove-Item -Recurse -Force android/build -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force android/app/build -ErrorAction SilentlyContinue

# Reinstall
npm install

# Rebuild
npx expo prebuild --clean

# Start fresh
npx expo start --clear
```

## After Clearing Cache

1. Press `r` in the terminal to reload the app
2. Or press `a` to run on Android
3. The error should be gone!

## Why This Happens

- Metro bundler caches module resolutions
- When files are deleted, the cache still references them
- Clearing the cache forces Metro to rebuild the dependency tree

## Prevention

Always clear cache after:
- Deleting screen files
- Removing imports
- Major refactoring
- Changing navigation structure

## Still Having Issues?

If the error persists:

1. Make sure no other terminal is running `expo start`
2. Close and reopen your terminal
3. Restart your computer (clears all temp files)
4. Check that all imports in App.js point to existing files

# EAS Build Guide for Android

## Prerequisites

1. **Install EAS CLI** (if not already installed)
```bash
npm install -g eas-cli
```

2. **Login to Expo**
```bash
eas login
```

3. **Configure Project** (if first time)
```bash
cd mobile
eas build:configure
```

## Build Profiles

Your app has 3 build profiles configured in `eas.json`:

### 1. Development Build
- For testing with development features
- Includes dev tools
- Internal distribution

### 2. Preview Build (APK)
- For testing before production
- Generates APK file
- Can be shared directly
- **Recommended for testing**

### 3. Production Build (APK)
- Final release version
- Optimized and minified
- Ready for Play Store or direct distribution

## Building the App

### Option 1: Preview Build (Recommended for Testing)

```bash
cd mobile
eas build --platform android --profile preview
```

This will:
- Build an APK file
- Take 10-20 minutes
- Provide download link when complete
- Can be installed directly on Android devices

### Option 2: Production Build

```bash
cd mobile
eas build --platform android --profile production
```

This will:
- Build optimized production APK
- Take 10-20 minutes
- Ready for distribution

### Option 3: Local Build (Faster, but requires Android Studio)

```bash
cd mobile
eas build --platform android --profile preview --local
```

## Build Process

1. **Start the build:**
```bash
cd mobile
eas build -p android --profile preview
```

2. **Wait for build to complete** (10-20 minutes)
   - You'll see build progress in terminal
   - Or check status at: https://expo.dev/accounts/[your-account]/projects/lifelink-app/builds

3. **Download the APK**
   - Link will be provided in terminal
   - Or download from Expo dashboard

4. **Install on Android device**
   - Transfer APK to device
   - Enable "Install from Unknown Sources"
   - Tap APK to install

## Quick Commands

```bash
# Preview build (APK for testing)
eas build -p android --profile preview

# Production build (APK for release)
eas build -p android --profile production

# Check build status
eas build:list

# View build details
eas build:view [build-id]

# Cancel a build
eas build:cancel
```

## Troubleshooting

### Build Fails

**Check credentials:**
```bash
eas credentials
```

**Clear cache and retry:**
```bash
eas build -p android --profile preview --clear-cache
```

### First Time Setup

If this is your first build, EAS will ask:
1. Generate a new Android Keystore? → **Yes**
2. Would you like to set up Push Notifications? → **Yes** (optional)

### Build Takes Too Long

- Normal build time: 10-20 minutes
- Check build queue: https://expo.dev
- Consider local build if you have Android Studio

## After Build Completes

1. **Download APK** from the provided link
2. **Transfer to Android device** via:
   - USB cable
   - Google Drive
   - Email
   - Direct download on device

3. **Install APK:**
   - Open file on Android device
   - Allow installation from unknown sources
   - Tap Install

## Version Management

Current version: **1.0.1**

To update version for next build:
1. Update `mobile/app.json`:
   - `version`: "1.0.2"
   - `android.versionCode`: 2
   - `runtimeVersion`: "1.0.2"

2. Update `mobile/src/screens/SettingsScreen.js`:
   - App name display

## Build Variants

### APK vs AAB

**APK (Current Setup)**
- ✅ Can install directly
- ✅ Easy to share
- ✅ Good for testing
- ❌ Larger file size

**AAB (For Play Store)**
```bash
# Change in eas.json:
"production": {
  "android": {
    "buildType": "app-bundle"
  }
}
```

## Monitoring Builds

**Via Terminal:**
```bash
eas build:list
```

**Via Web:**
https://expo.dev/accounts/[your-account]/projects/lifelink-app/builds

## Cost

- EAS Build is **free** for:
  - 30 builds/month (iOS + Android combined)
  - Unlimited builds with paid plan

## Next Steps After Building

1. Test the APK thoroughly
2. Check all features work:
   - SOS countdown timer
   - Emergency contacts
   - Maps (if built with native modules)
   - Location services
   - Phone calls

3. If everything works:
   - Build production version
   - Distribute to users
   - Or submit to Play Store

## Play Store Submission

To submit to Google Play Store:

1. Build AAB instead of APK
2. Create Play Store account ($25 one-time fee)
3. Prepare store listing:
   - App description
   - Screenshots
   - Privacy policy
   - App icon

4. Submit for review

## Support

- EAS Build Docs: https://docs.expo.dev/build/introduction/
- Expo Forums: https://forums.expo.dev/
- Check build logs for errors

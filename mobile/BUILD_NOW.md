# Build Android APK Now

## Quick Start (3 Steps)

### 1. Install EAS CLI (if not installed)
```bash
npm install -g eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Build APK
```bash
cd mobile
eas build -p android --profile preview
```

That's it! Wait 10-20 minutes and download your APK.

---

## Or Use the Script

**Windows:**
```bash
cd mobile
.\build-android.bat
```

**Mac/Linux:**
```bash
cd mobile
chmod +x build-android.sh
./build-android.sh
```

---

## What Happens Next?

1. ✅ Build starts on Expo servers
2. ⏳ Wait 10-20 minutes
3. 📥 Download link provided
4. 📱 Install APK on Android device

---

## Check Build Status

```bash
eas build:list
```

Or visit: https://expo.dev

---

## First Time?

EAS will ask:
- Generate Android Keystore? → **Yes**
- Setup Push Notifications? → **Yes** (optional)

---

## Need Help?

See `BUILD_GUIDE.md` for detailed instructions.

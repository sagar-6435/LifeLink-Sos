# Quick Start - Free Maps Integration

## ✅ What's Done

Your app now has FREE maps using OpenStreetMap (no API keys, no billing)!

### Updated Files:
1. **AmbulanceTracking.js** - Full tracking with animated ambulance
2. **trackScreen.js** - Live location tracking map
3. **MapExample.js** - Reusable map component

## 🚀 How to Run

```bash
cd mobile

# Rebuild the app (required for native modules)
npx expo prebuild --clean

# Run on Android
npx expo run:android

# Or run on iOS
npx expo run:ios
```

## 📱 Features

### AmbulanceTracking Screen
- Real-time ambulance location
- Route polyline showing path
- Dark themed map
- Auto-centering on markers
- Simulated ambulance movement

### TrackScreen
- User location marker
- Ambulance location marker
- Live indicator badge
- Clean, simple interface

## 🗺️ Map Providers (All FREE!)

- **Android**: Uses OpenStreetMap (default)
- **iOS**: Uses Apple Maps (built-in)

Both work without any API keys or billing!

## 💡 Quick Examples

### Add a marker:
```javascript
<Marker
  coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
  title="Hospital"
  description="City General Hospital"
/>
```

### Draw a route:
```javascript
<Polyline
  coordinates={[
    { latitude: 37.78825, longitude: -122.4324 },
    { latitude: 37.79825, longitude: -122.4424 },
  ]}
  strokeColor="#1963eb"
  strokeWidth={4}
/>
```

### Custom marker with icon:
```javascript
<Marker coordinate={location}>
  <View style={styles.customMarker}>
    <MaterialCommunityIcons name="hospital" size={24} color="#fff" />
  </View>
</Marker>
```

## 🎨 Customization

### Change map region:
```javascript
<MapView
  initialRegion={{
    latitude: YOUR_LAT,
    longitude: YOUR_LONG,
    latitudeDelta: 0.02,  // Zoom level
    longitudeDelta: 0.02,
  }}
/>
```

### Add more markers:
Just add more `<Marker>` components inside `<MapView>`

### Change marker colors:
Update the `backgroundColor` in marker styles

## 🔧 Troubleshooting

**Map not showing?**
- Run `npx expo prebuild --clean`
- Rebuild the app completely
- Make sure you're testing on a device/emulator (not web)

**Location not working?**
- Permissions are already added in app.json
- Grant location permission when app asks

## 📚 Next Steps

1. Connect to real GPS location using `expo-location`
2. Fetch real ambulance locations from your backend
3. Add more map features (circles, polygons, etc.)
4. Implement turn-by-turn directions

See `MAP_SETUP.md` for detailed documentation!

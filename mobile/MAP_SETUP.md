# Maps Setup Guide

This app uses `react-native-maps` with OpenStreetMap (completely FREE, no API key needed!).

## Setup Instructions

### 1. Install Dependencies
Already installed:
```bash
npm install react-native-maps
```

### 2. No API Key Required! 🎉

Unlike Google Maps, OpenStreetMap is completely free and doesn't require any API keys or billing setup. The maps will work out of the box.

### 3. Rebuild the App

```bash
# For development
npx expo prebuild --clean

# For Android
npx expo run:android

# For iOS
npx expo run:ios
```

## Usage Examples

### Basic Map Component

```javascript
import MapView, { Marker } from 'react-native-maps';

<MapView
  style={{ flex: 1 }}
  initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
>
  <Marker
    coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
    title="My Location"
    description="I am here"
  />
</MapView>
```

### Using the MapExample Component

```javascript
import MapExample from '../components/MapExample';

const markers = [
  {
    coordinate: { latitude: 37.78825, longitude: -122.4324 },
    title: "Hospital",
    description: "City General Hospital",
    icon: "hospital-building",
    color: "#ef4444"
  }
];

<MapExample
  location={{ latitude: 37.78825, longitude: -122.4324 }}
  markers={markers}
  onMarkerPress={(marker) => console.log('Marker pressed:', marker)}
/>
```

### AmbulanceTracking Screen

The `AmbulanceTracking.js` screen shows a complete example with:
- Real-time ambulance tracking
- Route polyline
- Custom markers
- Dark map theme
- Animated marker updates

## Features Implemented

- ✅ OpenStreetMap integration (FREE!)
- ✅ Custom markers with icons
- ✅ Route polylines
- ✅ Dark map theme
- ✅ Real-time location updates
- ✅ Map controls (center, layers)
- ✅ Location permissions
- ✅ No API key required
- ✅ No billing required

## Map Providers

By default, `react-native-maps` uses:
- **iOS**: Apple Maps (built-in, free)
- **Android**: OpenStreetMap via MapView (free)

Both are completely free with no API keys or billing required!

## Troubleshooting

### Map not showing (blank screen)
- Make sure you've run `npx expo prebuild --clean`
- Rebuild the app completely
- Check location permissions are granted

### Location permissions
- Permissions are already added in app.json
- Request permissions at runtime using expo-location if needed

### Styling not working
- Custom map styles work differently on iOS (Apple Maps) vs Android
- The dark theme is applied via the `customMapStyle` prop

## Alternative Free Map Options

If you need more features, consider:

1. **Mapbox** (Free tier: 50,000 requests/month)
   - Better styling options
   - More features
   - Requires API key but has generous free tier

2. **OpenStreetMap** (Current - Completely Free)
   - No limits
   - No API key
   - Community-driven
   - Good for most use cases

3. **Apple Maps** (iOS only - Free)
   - Native iOS maps
   - No API key needed
   - Works automatically on iOS

## Additional Resources

- [react-native-maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [Expo Maps Guide](https://docs.expo.dev/versions/latest/sdk/map-view/)

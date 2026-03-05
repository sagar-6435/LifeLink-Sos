# Voice Emergency Auto-Activation Feature

## Overview
When a user taps the SOS button on the HomeScreen, the microphone automatically activates and begins recording. The AI then understands the emergency situation and calls all emergency contacts to explain the situation.

## How It Works

### 1. SOS Button Trigger (HomeScreen.js)
- User taps the SOS button
- 5-second countdown modal appears
- After countdown, `triggerAIEmergency()` is called
- Navigates to `VoiceEmergencyScreen` with `autoActivate: true` flag

### 2. Auto-Activation (VoiceEmergencyScreen.js)
- Screen receives `autoActivate` parameter from route
- On component mount, if `autoActivate` is true:
  - Automatically starts recording after 500ms
  - Sets status to "listening"
  - Auto-stops recording after 15 seconds
  - Processes the audio immediately

### 3. AI Understanding & Processing
- Audio is converted to base64
- Sent to backend `/api/agents/voice-emergency` endpoint
- Backend performs:
  - Speech-to-text conversion
  - AI analysis of the emergency situation
  - Returns understood situation description
- Shows alert with what was understood
- Navigates to EmergencyCall screen with situation details

### 4. Emergency Contact Notification
- AI calls all emergency contacts
- AI explains the understood emergency situation
- Shares user's location
- Provides real-time updates

## Key Features

✅ **Automatic Microphone Activation** - No manual tap needed
✅ **AI Situation Understanding** - Analyzes what user says
✅ **Smart Contact Calling** - Calls all emergency contacts
✅ **Situation Explanation** - AI explains to contacts what happened
✅ **Location Sharing** - Automatically includes user location
✅ **Fallback Support** - Works even if AI processing fails
✅ **15-Second Auto-Stop** - Prevents infinite recording

## User Flow

```
User taps SOS
    ↓
5-second countdown
    ↓
Microphone auto-activates
    ↓
User describes emergency (15 seconds max)
    ↓
AI processes audio & understands situation
    ↓
Alert shows what was understood
    ↓
AI calls emergency contacts
    ↓
AI explains situation to each contact
    ↓
Emergency response initiated
```

## Status Messages

- **Ready**: "Tap to describe your emergency"
- **Listening**: "🎤 Listening... Describe your emergency clearly"
- **Processing**: "Processing your emergency..."
- **Calling**: "📞 Calling X emergency contact(s)..."

## Error Handling

- If no emergency contacts: Shows alert and prevents activation
- If audio processing fails: Falls back to generic emergency message
- If backend unavailable: Uses local fallback with generic message
- If location unavailable: Proceeds without location data

## Configuration

- **Auto-stop duration**: 15 seconds (can be adjusted in `recordingTimeoutRef`)
- **Delay before auto-start**: 500ms (allows UI to render)
- **Countdown duration**: 5 seconds (set in HomeScreen)

## Files Modified

1. **mobile/src/screens/HomeScreen.js**
   - Updated `triggerAIEmergency()` to navigate to VoiceEmergencyScreen
   - Passes `autoActivate: true` flag

2. **mobile/src/screens/VoiceEmergencyScreen.js**
   - Added `autoActivate` parameter handling
   - Auto-starts recording on mount if flag is true
   - Enhanced status messages with emojis
   - Improved error handling and fallback logic
   - Added `recordingTimeoutRef` for auto-stop functionality

## Testing

To test the feature:
1. Tap SOS button on HomeScreen
2. Wait for 5-second countdown
3. Microphone should auto-activate
4. Speak your emergency (e.g., "I fell and can't get up")
5. After 15 seconds, recording stops automatically
6. AI processes and shows what it understood
7. Emergency contacts are called with explanation

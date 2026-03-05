# Emergency Calling System - AI Multi-Contact Calling

## Overview
When a user describes their emergency situation via voice, the system automatically calls up to 3 emergency contacts simultaneously. Each contact receives an AI-powered call that explains the emergency situation in detail.

## How It Works

### 1. User Activates SOS
- User taps SOS button on HomeScreen
- 5-second countdown appears
- Microphone auto-activates on VoiceEmergencyScreen

### 2. User Describes Emergency
- User speaks their emergency situation (max 15 seconds)
- Audio is recorded in high quality
- Examples: "I fell and can't get up", "I'm having chest pain", "I've been in an accident"

### 3. AI Understands Situation
- Audio is sent to backend for speech-to-text conversion
- AI analyzes the situation
- Backend returns understood situation description
- Example: "User has fallen and cannot get up. Requires immediate medical assistance."

### 4. Emergency Contacts Called (Up to 3 Simultaneously)
- System loads emergency contacts from local storage
- Selects first 3 contacts (if more than 3 exist)
- Initiates AI calls to all 3 contacts AT THE SAME TIME
- Each contact receives a call from the AI agent

### 5. AI Explains Situation to Each Contact
- AI agent speaks to each contact
- Explains the emergency situation in detail
- Provides user's location
- Requests immediate assistance
- Conversation is recorded for reference

### 6. SMS Alerts Sent
- After AI calls complete, SMS alerts are sent to all contacts
- SMS includes emergency details and location link
- Provides backup notification method

## Call Flow Diagram

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
System loads emergency contacts
    ↓
Selects first 3 contacts
    ↓
Initiates 3 AI calls SIMULTANEOUSLY
    ↓
Contact 1 ← AI Call → Contact 2 ← AI Call → Contact 3
    ↓
AI explains situation to each contact
    ↓
SMS alerts sent to all contacts
    ↓
Emergency response initiated
```

## Key Features

✅ **Simultaneous Calling** - Calls up to 3 contacts at the same time (not sequentially)
✅ **AI Explanation** - Each contact hears AI explain the situation
✅ **Situation Understanding** - AI analyzes what user said
✅ **Location Sharing** - User's location is included in calls
✅ **SMS Backup** - Text alerts sent after calls
✅ **Call Status Tracking** - Real-time status for each contact
✅ **Fallback Support** - Works even if AI processing fails
✅ **Contact Limit** - Max 3 simultaneous calls for reliability

## Contact Selection Logic

- **If 1-3 contacts**: All contacts are called
- **If 4+ contacts**: First 3 contacts are called
- **If 0 contacts**: Fallback to backend emergency number

Example:
```
Contacts added: [Mom, Dad, Sister, Brother, Friend]
Contacts called: [Mom, Dad, Sister]
Contacts not called: [Brother, Friend]
```

## AI Call Details

### What the AI Says
The AI agent explains:
1. User's name
2. Emergency situation (from voice analysis)
3. User's location (address or coordinates)
4. Request for immediate assistance
5. Instructions for next steps

### Example AI Call Script
```
"Hello, this is an emergency alert from LifeLink. 
[User Name] has activated an emergency and described their situation as: 
'I fell and can't get up'. 

Their location is: [Address/Coordinates]

This is an automated AI call. Please provide immediate assistance. 
If you cannot help, please contact emergency services immediately.

Thank you."
```

## Status Indicators

### Call Status States
- **Initiating** - Call is being set up
- **Calling** - Phone is ringing
- **Speaking** - AI is connected and speaking with contact
- **Failed** - Call could not be completed

### Visual Indicators
- 🕐 Initiating (Gray)
- 📞 Calling (Blue)
- ✅ Speaking (Green)
- ❌ Failed (Red)

## UI Display

### Emergency Call Screen Shows:
1. **Call Sequence Status**
   - Preparing Emergency
   - AI Calling Contacts
   - SMS Alerts

2. **Individual Contact Status** (Up to 3)
   - Contact number (1, 2, 3)
   - Contact name
   - Contact phone
   - Relationship
   - Current status (Initiating/Calling/Speaking/Failed)

3. **Real-time Timer**
   - Shows elapsed time since emergency started
   - Format: MM:SS

4. **Action Buttons**
   - Mute
   - Speaker
   - Location
   - End Call

## Error Handling

### No Emergency Contacts
- Shows alert: "No Emergency Contacts"
- Calls fallback emergency number from backend
- Prompts user to add contacts

### AI Processing Fails
- Falls back to generic emergency message
- Still calls all contacts
- Provides basic emergency information

### Call Fails for Specific Contact
- Marks contact as "Failed"
- Continues calling other contacts
- SMS still sent to failed contact

### Backend Unavailable
- Uses local emergency contacts
- Proceeds with calling
- SMS may not be sent

## Configuration

### Maximum Simultaneous Calls
- **Current**: 3 contacts
- **Location**: `EmergencyCallScreen.js` line ~180
- **To change**: Modify `contactsToCall = contacts.slice(0, 3)`

### Auto-Stop Recording Duration
- **Current**: 15 seconds
- **Location**: `VoiceEmergencyScreen.js` line ~50
- **To change**: Modify `recordingTimeoutRef.current = setTimeout(..., 15000)`

### Countdown Duration
- **Current**: 5 seconds
- **Location**: `HomeScreen.js` line ~220
- **To change**: Modify `setCountdown(5)`

## Files Modified

1. **mobile/src/screens/HomeScreen.js**
   - Updated `triggerAIEmergency()` to navigate to VoiceEmergencyScreen
   - Passes `autoActivate: true` flag

2. **mobile/src/screens/VoiceEmergencyScreen.js**
   - Added auto-activation on mount
   - Enhanced status messages
   - Improved error handling

3. **mobile/src/screens/EmergencyCallScreen.js**
   - Updated `makeAICallsToContacts()` to limit to 3 contacts
   - Calls all 3 simultaneously using `Promise.all()`
   - Enhanced UI to show all 3 contacts being called
   - Added detailed status tracking for each contact
   - Improved alert messages

## Testing Checklist

- [ ] Add 3+ emergency contacts
- [ ] Tap SOS button
- [ ] Wait for 5-second countdown
- [ ] Microphone auto-activates
- [ ] Speak emergency (e.g., "I fell and can't get up")
- [ ] After 15 seconds, recording stops
- [ ] AI processes and shows understood situation
- [ ] Alert confirms what was understood
- [ ] Emergency Call screen shows 3 contacts
- [ ] All 3 contacts show "Calling" status simultaneously
- [ ] Status changes to "Speaking" when AI connects
- [ ] Timer counts up
- [ ] SMS alerts sent after calls complete
- [ ] Can end call with "End Call" button

## Limitations & Future Improvements

### Current Limitations
- Maximum 3 simultaneous calls (for reliability)
- 15-second max recording time
- Requires internet connection for AI processing

### Future Improvements
- [ ] Support for more than 3 simultaneous calls
- [ ] Longer recording duration
- [ ] Offline fallback mode
- [ ] Call recording and playback
- [ ] Contact priority ordering
- [ ] Custom AI scripts per contact
- [ ] Multi-language support
- [ ] Video call option

## Troubleshooting

### Calls Not Going Through
1. Check internet connection
2. Verify emergency contacts are saved
3. Check phone permissions for calling
4. Verify backend API is running

### AI Not Understanding Situation
1. Speak clearly and slowly
2. Describe situation concisely
3. Avoid background noise
4. Check microphone permissions

### Contacts Not Receiving Calls
1. Verify phone numbers are correct
2. Check contact's phone is on
3. Verify backend calling service is configured
4. Check SMS service for SMS alerts

## Support

For issues or questions about the emergency calling system, please contact support or check the backend logs for detailed error information.

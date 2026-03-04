# SOS Emergency Countdown Feature

## Overview

When the user presses the SOS button, a 10-second countdown timer is displayed. If not canceled, the app will automatically:
1. Call emergency services (Ambulance 108, Police 100)
2. Alert all emergency contacts
3. Navigate to the emergency call screen

## How It Works

### User Flow

1. **User presses SOS button**
   - Countdown modal appears
   - 10-second timer starts

2. **During countdown (10 seconds)**
   - Large countdown number displayed
   - Shows what will happen:
     - Call Ambulance (108)
     - Call Police (100)
     - Alert emergency contacts
   - User can press CANCEL button to stop

3. **If countdown reaches 0**
   - Emergency services dialog appears
   - User can choose to call Ambulance or Police
   - Emergency alert sent to all contacts
   - Navigates to EmergencyCall screen

4. **If user cancels**
   - Countdown stops
   - Modal closes
   - No emergency triggered

## Features

### Visual Design
- ✅ Full-screen modal with dark overlay
- ✅ Large red countdown circle
- ✅ Alert icon at top
- ✅ Clear information about what will happen
- ✅ Prominent CANCEL button

### Functionality
- ✅ 10-second countdown timer
- ✅ Automatic emergency call trigger
- ✅ Emergency contact alerts
- ✅ Cancel anytime during countdown
- ✅ Cleanup on component unmount

### Emergency Numbers (India)
- **Ambulance**: 108
- **Police**: 100
- **Fire**: 101

## Code Structure

### State Management
```javascript
const [showCountdown, setShowCountdown] = useState(false);
const [countdown, setCountdown] = useState(10);
const countdownInterval = useRef(null);
```

### Key Functions

**handleSOSPress()**
- Checks if emergency contacts exist
- Starts 10-second countdown
- Shows countdown modal

**cancelCountdown()**
- Stops the countdown timer
- Closes the modal
- Resets countdown to 10

**triggerEmergency()**
- Called when countdown reaches 0
- Makes emergency calls
- Sends alerts to contacts
- Navigates to emergency screen

**makeEmergencyCalls()**
- Shows dialog with emergency numbers
- Allows user to call Ambulance or Police
- Uses Linking API to make calls

## Testing

### Test Scenarios

1. **Normal Flow**
   - Press SOS button
   - Wait for countdown to reach 0
   - Verify emergency dialog appears

2. **Cancel Flow**
   - Press SOS button
   - Press CANCEL before countdown ends
   - Verify modal closes and no emergency triggered

3. **No Contacts**
   - Remove all emergency contacts
   - Press SOS button
   - Verify alert prompts to add contacts

4. **Navigation**
   - Complete countdown
   - Verify navigation to EmergencyCall screen

## Customization

### Change Countdown Duration
```javascript
// In handleSOSPress()
setCountdown(10); // Change to desired seconds
```

### Change Emergency Numbers
```javascript
// In makeEmergencyCalls()
const emergencyNumbers = {
  ambulance: '108', // Your country's ambulance
  police: '100',    // Your country's police
  fire: '101',      // Your country's fire
};
```

### Styling
All styles are in the `styles` object at the bottom of HomeScreen.js:
- `modalOverlay` - Background overlay
- `countdownContainer` - Main modal container
- `countdownCircle` - Red countdown circle
- `cancelButton` - Cancel button style

## Safety Features

1. **Cleanup on Unmount**
   - Timer is cleared if user navigates away
   - Prevents memory leaks

2. **Cancel Anytime**
   - Large, accessible cancel button
   - Prevents accidental emergency calls

3. **Clear Information**
   - Shows exactly what will happen
   - Lists all actions before triggering

4. **Confirmation Required**
   - Even after countdown, user chooses which service to call
   - Prevents unwanted calls

## Future Enhancements

Possible improvements:
- [ ] Add sound/vibration during countdown
- [ ] Send SMS to emergency contacts
- [ ] Share live location with contacts
- [ ] Add voice announcement
- [ ] Configurable countdown duration in settings
- [ ] Auto-call without confirmation option
- [ ] Emergency message customization

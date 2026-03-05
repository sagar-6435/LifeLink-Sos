# Debug: Emergency Contacts Not Loading After Adding

## Problem
User adds emergency contacts, but when SOS is tapped, the app says "No Emergency Contacts" even though they were already added.

## Root Cause
The emergency contacts are not being properly loaded from AsyncStorage when HomeScreen mounts, or the state is not being updated correctly.

## Solution: Step-by-Step Debugging

### Step 1: Check if Contacts Are Actually Saved

**In React Native Debugger Console:**
```javascript
// Check what's in AsyncStorage
const contacts = await AsyncStorage.getItem('emergencyContacts');
console.log('Raw AsyncStorage value:', contacts);
console.log('Parsed:', JSON.parse(contacts));
```

**Expected Output:**
```json
[
  {
    "name": "Mom",
    "phone": "+919876543210",
    "relation": "Mother"
  }
]
```

**If Empty or null:**
- Contacts were not saved properly
- Go to Step 2

### Step 2: Verify Contacts Are Being Saved

**When Adding Contacts:**
1. Open app
2. Go to HomeScreen → Contacts
3. Add a contact:
   - Name: "Test"
   - Phone: "+919876543210"
   - Relation: "Friend"
4. Tap "Add Contact"
5. Check console logs:

**Expected Logs:**
```
💾 Saving emergency contacts...
Contacts to save: [{"name":"Test","phone":"+919876543210","relation":"Friend"}]
✅ Emergency contacts saved to AsyncStorage: 1 contacts
✅ Verification - Contacts in AsyncStorage: [{"name":"Test",...}]
```

**If Logs Show Error:**
- Check AsyncStorage permissions
- Check if storage is full
- Try clearing app cache

### Step 3: Verify Contacts Load on HomeScreen

**When Opening HomeScreen:**
1. Close app completely
2. Reopen app
3. Check console logs:

**Expected Logs:**
```
📱 Checking AsyncStorage for emergencyContacts...
Raw value: [{"name":"Test",...}]
✅ Loaded emergency contacts from local storage: 1 contacts
Contacts: [{"name":"Test",...}]
```

**If Logs Show:**
```
⚠️ No emergency contacts found in AsyncStorage
```
- Contacts were not saved properly
- Go back to Step 2

### Step 4: Verify SOS Button Check

**When Tapping SOS:**
1. Tap SOS button
2. Check console logs:

**Expected Logs:**
```
🆘 SOS Button Pressed
Current emergencyContacts state: [{"name":"Test",...}]
emergencyContacts.length: 1
✅ Emergency contacts found: 1
```

**If Logs Show:**
```
❌ No emergency contacts found in state
Checking AsyncStorage directly: [{"name":"Test",...}]
```
- State is not being updated from AsyncStorage
- Go to Step 5

### Step 5: Force Reload Contacts

**If contacts are in AsyncStorage but not in state:**

1. **Manually Reload:**
   ```javascript
   // In React Native Debugger
   const contacts = await AsyncStorage.getItem('emergencyContacts');
   // Then navigate away and back to HomeScreen
   ```

2. **Or Restart App:**
   - Close app completely
   - Reopen app
   - Check if contacts load

3. **Or Clear and Re-add:**
   - Go to Contacts
   - Remove all contacts
   - Add contacts again
   - Save

### Step 6: Check AsyncStorage Persistence

**Test if AsyncStorage is working:**
```javascript
// In React Native Debugger
await AsyncStorage.setItem('test_key', 'test_value');
const value = await AsyncStorage.getItem('test_key');
console.log('Test value:', value); // Should be 'test_value'
```

**If Test Fails:**
- AsyncStorage might not be working
- Check if app has storage permissions
- Try clearing app cache and data

---

## Complete Debugging Checklist

### Contacts Saving
- [ ] Console shows "💾 Saving emergency contacts..."
- [ ] Console shows "✅ Emergency contacts saved to AsyncStorage"
- [ ] Console shows "✅ Verification - Contacts in AsyncStorage"
- [ ] No errors in console

### Contacts Loading
- [ ] Console shows "📱 Checking AsyncStorage for emergencyContacts..."
- [ ] Console shows "✅ Loaded emergency contacts from local storage"
- [ ] Console shows contact count and details
- [ ] No errors in console

### SOS Button
- [ ] Console shows "🆘 SOS Button Pressed"
- [ ] Console shows "Current emergencyContacts state: [...]"
- [ ] Console shows "✅ Emergency contacts found: X"
- [ ] SOS countdown starts (not "No Emergency Contacts" alert)

### AsyncStorage
- [ ] Test key/value works
- [ ] Contacts persist after app restart
- [ ] No storage permission errors

---

## Common Issues & Fixes

### Issue 1: Contacts Save But Don't Load

**Symptom:**
- Contacts save successfully
- But HomeScreen shows "No Emergency Contacts"

**Cause:**
- `loadEmergencyContacts` not being called on mount
- State not being updated from AsyncStorage

**Fix:**
```javascript
// Make sure useEffect calls loadEmergencyContacts
useEffect(() => {
  loadEmergencyContacts(); // This must be called
}, []);

// And useFocusEffect reloads when screen comes into focus
useFocusEffect(
  useCallback(() => {
    loadEmergencyContacts();
  }, [])
);
```

### Issue 2: Contacts Load But SOS Still Says "No Contacts"

**Symptom:**
- Console shows contacts loaded
- But SOS button shows "No Emergency Contacts" alert

**Cause:**
- `emergencyContacts` state not updated
- Race condition between state update and SOS press

**Fix:**
```javascript
// Add delay to ensure state is updated
const handleSOSPress = async () => {
  // Wait for state to update
  await new Promise(resolve => setTimeout(resolve, 100));
  
  if (emergencyContacts.length === 0) {
    // Show alert
  }
};
```

### Issue 3: AsyncStorage Returns null

**Symptom:**
- Console shows "Raw value: null"
- Contacts not found in AsyncStorage

**Cause:**
- Contacts were never saved
- AsyncStorage was cleared
- Storage permission denied

**Fix:**
1. Check if contacts were saved (Step 2)
2. Check storage permissions
3. Try adding contacts again
4. Clear app cache: Settings → Apps → [App] → Storage → Clear Cache

### Issue 4: JSON Parse Error

**Symptom:**
- Console shows error parsing contacts
- "SyntaxError: Unexpected token..."

**Cause:**
- Corrupted data in AsyncStorage
- Invalid JSON format

**Fix:**
```javascript
// Clear corrupted data
await AsyncStorage.removeItem('emergencyContacts');

// Add contacts again
```

---

## Manual Testing Steps

### Test 1: Add and Verify Contacts

1. **Add Contact:**
   - HomeScreen → Contacts
   - Add: Name="Mom", Phone="+919876543210"
   - Tap "Add Contact"
   - Check console for save logs

2. **Verify Saved:**
   ```javascript
   const contacts = await AsyncStorage.getItem('emergencyContacts');
   console.log(JSON.parse(contacts));
   ```

3. **Restart App:**
   - Close app completely
   - Reopen app
   - Check console for load logs

4. **Tap SOS:**
   - Tap SOS button
   - Should NOT show "No Emergency Contacts"
   - Should show 5-second countdown

### Test 2: Multiple Contacts

1. Add 3 contacts
2. Verify all 3 are saved
3. Restart app
4. Verify all 3 load
5. Tap SOS
6. Should proceed to voice recording

### Test 3: Contact Persistence

1. Add contact
2. Close app
3. Reopen app
4. Contact should still be there
5. Tap SOS
6. Should work

---

## Console Log Reference

### When Adding Contacts
```
💾 Saving emergency contacts...
Contacts to save: [...]
✅ Emergency contacts saved to AsyncStorage: 1 contacts
✅ Verification - Contacts in AsyncStorage: [...]
```

### When Loading Contacts
```
📱 Checking AsyncStorage for emergencyContacts...
Raw value: [...]
✅ Loaded emergency contacts from local storage: 1 contacts
Contacts: [...]
```

### When Tapping SOS
```
🆘 SOS Button Pressed
Current emergencyContacts state: [...]
emergencyContacts.length: 1
✅ Emergency contacts found: 1
```

### Error Cases
```
❌ No emergency contacts found in state
Checking AsyncStorage directly: [...]

❌ Error parsing emergency contacts: [error]

⚠️ No emergency contacts found in AsyncStorage
```

---

## If Still Not Working

### Option 1: Clear and Restart
```bash
# Clear app cache
# iOS: Settings → General → iPhone Storage → [App] → Offload App
# Android: Settings → Apps → [App] → Storage → Clear Cache

# Restart app
# Add contacts again
# Test SOS
```

### Option 2: Check AsyncStorage Implementation
```javascript
// Verify AsyncStorage is imported correctly
import AsyncStorage from '@react-native-async-storage/async-storage';

// Verify it's installed
npm list @react-native-async-storage/async-storage
```

### Option 3: Check React Navigation
```javascript
// Verify useFocusEffect is imported
import { useFocusEffect } from '@react-navigation/native';

// Verify it's being used
useFocusEffect(
  useCallback(() => {
    loadEmergencyContacts();
  }, [])
);
```

### Option 4: Manual AsyncStorage Test
```javascript
// Test AsyncStorage directly
import AsyncStorage from '@react-native-async-storage/async-storage';

// Save
await AsyncStorage.setItem('test', JSON.stringify({name: 'Test'}));

// Load
const value = await AsyncStorage.getItem('test');
console.log(JSON.parse(value)); // Should show {name: 'Test'}
```

---

## Support

If none of these steps work:

1. Check React Native Debugger console for all logs
2. Check if AsyncStorage is properly installed
3. Check if app has storage permissions
4. Try on different device/emulator
5. Check if there's a React Navigation issue
6. Review the complete flow in HomeScreen.js


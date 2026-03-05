# Quick Fix: Emergency Contacts Not Loading

## The Problem
✅ You added emergency contacts  
❌ But SOS says "No Emergency Contacts"

## The Solution

### Step 1: Check Console Logs

**Open React Native Debugger and look for these logs:**

When you tap SOS, you should see:
```
🆘 SOS Button Pressed
Current emergencyContacts state: [...]
emergencyContacts.length: 1
✅ Emergency contacts found: 1
```

**If you see instead:**
```
❌ No emergency contacts found in state
Checking AsyncStorage directly: [...]
```

Then the contacts are saved but not loading into the app state.

---

### Step 2: Force Reload Contacts

**Option A: Restart the App**
1. Close app completely (swipe up on iOS, back button on Android)
2. Reopen app
3. Go to HomeScreen
4. Tap SOS again

**Option B: Navigate Away and Back**
1. From HomeScreen, go to Contacts
2. Then go back to HomeScreen
3. Tap SOS

**Option C: Manual Reload in Console**
```javascript
// In React Native Debugger console
const contacts = await AsyncStorage.getItem('emergencyContacts');
console.log('Contacts in storage:', JSON.parse(contacts));
```

---

### Step 3: Verify Contacts Are Actually Saved

**In React Native Debugger Console:**
```javascript
const contacts = await AsyncStorage.getItem('emergencyContacts');
console.log(JSON.parse(contacts));
```

**You should see:**
```json
[
  {
    "name": "Mom",
    "phone": "+919876543210",
    "relation": "Mother"
  }
]
```

**If you see `null`:**
- Contacts were not saved
- Go to Step 4

---

### Step 4: Re-add Contacts

If contacts are not in AsyncStorage:

1. **Go to HomeScreen**
2. **Tap Contacts** (bottom navigation)
3. **Add Emergency Contact:**
   - Tap "+ Manual"
   - Name: "Mom"
   - Phone: "+919876543210"
   - Relation: "Mother"
   - Tap "Add Contact"
4. **Check Console:**
   ```
   💾 Saving emergency contacts...
   ✅ Emergency contacts saved to AsyncStorage: 1 contacts
   ✅ Verification - Contacts in AsyncStorage: [...]
   ```
5. **Tap "Save Emergency Contacts"** button
6. **Wait for success alert**

---

### Step 5: Test SOS Again

1. **Go back to HomeScreen**
2. **Tap SOS button**
3. **Check console for:**
   ```
   🆘 SOS Button Pressed
   ✅ Emergency contacts found: 1
   ```
4. **Should see 5-second countdown** (not "No Emergency Contacts" alert)

---

## If Still Not Working

### Clear App Cache

**iOS:**
1. Settings → General → iPhone Storage
2. Find your app
3. Tap "Offload App"
4. Tap "Reinstall App"

**Android:**
1. Settings → Apps
2. Find your app
3. Tap "Storage"
4. Tap "Clear Cache"

Then:
1. Restart app
2. Add contacts again
3. Test SOS

---

### Check AsyncStorage is Working

```javascript
// In React Native Debugger console
// Test 1: Save
await AsyncStorage.setItem('test_key', 'test_value');

// Test 2: Load
const value = await AsyncStorage.getItem('test_key');
console.log(value); // Should show: test_value

// Test 3: Delete
await AsyncStorage.removeItem('test_key');
```

If any of these fail, AsyncStorage might not be working properly.

---

## Complete Checklist

- [ ] Added emergency contact with phone number
- [ ] Tapped "Add Contact" button
- [ ] Tapped "Save Emergency Contacts" button
- [ ] Got "Success" alert
- [ ] Restarted app
- [ ] Went to HomeScreen
- [ ] Tapped SOS button
- [ ] Saw 5-second countdown (not "No Emergency Contacts" alert)
- [ ] Microphone auto-activated
- [ ] Spoke emergency situation
- [ ] AI processed audio
- [ ] Emergency Call screen appeared

---

## What the Logs Should Show

### Adding Contact
```
💾 Saving emergency contacts...
Contacts to save: [{"name":"Mom","phone":"+919876543210","relation":"Mother"}]
✅ Emergency contacts saved to AsyncStorage: 1 contacts
✅ Verification - Contacts in AsyncStorage: [{"name":"Mom",...}]
```

### Loading Contacts (on app start)
```
📱 Checking AsyncStorage for emergencyContacts...
Raw value: [{"name":"Mom",...}]
✅ Loaded emergency contacts from local storage: 1 contacts
Contacts: [{"name":"Mom",...}]
```

### Tapping SOS
```
🆘 SOS Button Pressed
Current emergencyContacts state: [{"name":"Mom",...}]
emergencyContacts.length: 1
✅ Emergency contacts found: 1
```

---

## Phone Number Format

**Must be in E.164 format:**
- ✅ `+919876543210` (correct)
- ❌ `9876543210` (missing +91)
- ❌ `91-9876543210` (wrong format)
- ❌ `(98) 7654-3210` (wrong format)

---

## Still Having Issues?

1. **Check console logs** - Look for error messages
2. **Clear app cache** - Settings → Apps → Clear Cache
3. **Restart app** - Close completely and reopen
4. **Re-add contacts** - Delete and add again
5. **Check phone format** - Must be +91XXXXXXXXXX
6. **Check AsyncStorage** - Run test commands above

---

## Success Indicators

✅ **You'll know it's working when:**
1. Console shows "✅ Emergency contacts found: X"
2. SOS button shows 5-second countdown
3. Microphone auto-activates
4. You can speak emergency
5. AI processes and calls contacts


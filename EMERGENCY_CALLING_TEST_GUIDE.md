# Emergency Calling - Complete Test Guide

## Pre-Test Checklist

### Backend Setup
- [ ] Backend server running: `npm run dev` (in backend folder)
- [ ] ngrok running: `ngrok http 3000`
- [ ] ngrok URL copied to backend/.env as PUBLIC_URL
- [ ] Twilio credentials in backend/.env:
  - TWILIO_ACCOUNT_SID
  - TWILIO_AUTH_TOKEN
  - TWILIO_PHONE_NUMBER
- [ ] MongoDB connected
- [ ] All environment variables set

### Mobile Setup
- [ ] App installed and running
- [ ] User logged in
- [ ] Emergency contacts added with proper phone format
- [ ] Microphone permissions granted
- [ ] Location permissions granted
- [ ] Network connection stable

### Twilio Setup
- [ ] Twilio account active
- [ ] Account has sufficient balance (at least $1)
- [ ] Phone numbers verified in Twilio Console
- [ ] Twilio phone number is active

## Test Scenario 1: Single Emergency Contact Call

### Setup
1. Add 1 emergency contact:
   - Name: "Test Contact"
   - Phone: "+919876543210" (replace with real number)
   - Relation: "Friend"

2. Verify contact saved:
   ```javascript
   const contacts = await AsyncStorage.getItem('emergencyContacts');
   console.log(JSON.parse(contacts));
   ```

### Execution
1. Open HomeScreen
2. Tap SOS button
3. Wait for 5-second countdown
4. Microphone auto-activates
5. Speak: "I fell and can't get up"
6. Wait 15 seconds (auto-stop)
7. AI processes audio
8. Alert shows understood situation
9. Emergency Call screen appears

### Expected Results
- ✅ Phone receives call from Twilio number
- ✅ AI agent speaks the situation
- ✅ Call status shows "Speaking"
- ✅ Call duration timer counts up
- ✅ Can respond to AI agent

### Verification
- [ ] Phone received call
- [ ] Caller ID shows Twilio number
- [ ] AI message is clear
- [ ] Can hear emergency situation explained
- [ ] Call connects properly

---

## Test Scenario 2: Multiple Emergency Contacts (3 Simultaneous)

### Setup
1. Add 3 emergency contacts:
   - Contact 1: "+919876543210"
   - Contact 2: "+919876543211"
   - Contact 3: "+919876543212"

2. Verify all contacts saved

### Execution
1. Open HomeScreen
2. Tap SOS button
3. Wait for countdown
4. Speak emergency situation
5. Wait for processing

### Expected Results
- ✅ All 3 phones receive calls simultaneously
- ✅ Each shows "Calling" status
- ✅ Each changes to "Speaking" when connected
- ✅ All calls happen at same time (not sequential)
- ✅ UI shows all 3 contacts with status

### Verification
- [ ] All 3 phones received calls
- [ ] Calls came at same time
- [ ] Each contact heard AI explanation
- [ ] UI updated for each contact
- [ ] All calls completed successfully

---

## Test Scenario 3: More Than 3 Contacts (Only First 3 Called)

### Setup
1. Add 5 emergency contacts:
   - Contact 1-5 with different phone numbers

### Execution
1. Trigger SOS
2. Speak situation
3. Wait for calls

### Expected Results
- ✅ Only first 3 contacts called
- ✅ Contacts 4-5 not called
- ✅ Console shows: "Calling 3 emergency contacts simultaneously (max 3)"
- ✅ Console shows: "5 additional emergency contacts not called"

### Verification
- [ ] Only 3 phones received calls
- [ ] Contacts 4-5 did not receive calls
- [ ] UI shows only 3 contacts
- [ ] Console logs confirm limit

---

## Test Scenario 4: No Emergency Contacts (Fallback)

### Setup
1. Delete all emergency contacts
2. Ensure EMERGENCY_CONTACT_NUMBER in backend/.env

### Execution
1. Trigger SOS
2. Speak situation
3. Wait for processing

### Expected Results
- ✅ Fallback number receives call
- ✅ Alert shows: "Calling emergency contact"
- ✅ Console shows: "using fallback number from backend"
- ✅ Call connects to fallback number

### Verification
- [ ] Fallback number received call
- [ ] Alert displayed
- [ ] Call completed successfully

---

## Test Scenario 5: Phone Number Format Validation

### Setup
1. Add contacts with different phone formats:
   - Contact 1: "9876543210" (10 digits)
   - Contact 2: "+919876543210" (E.164)
   - Contact 3: "91-9876543210" (with dashes)

### Execution
1. Trigger SOS
2. Monitor console logs

### Expected Results
- ✅ All formats converted to E.164
- ✅ Console shows: "+919876543210" for all
- ✅ All calls go through successfully

### Verification
- [ ] All phones received calls
- [ ] Console shows E.164 format
- [ ] No format-related errors

---

## Test Scenario 6: API Error Handling

### Setup
1. Temporarily disable backend
2. Add emergency contacts

### Execution
1. Trigger SOS
2. Observe error handling

### Expected Results
- ✅ Error logged in console
- ✅ Call status shows "failed"
- ✅ Alert shows error message
- ✅ App doesn't crash

### Verification
- [ ] Error handled gracefully
- [ ] UI shows failed status
- [ ] App remains responsive

---

## Test Scenario 7: Voice Recognition

### Setup
1. Add emergency contact
2. Prepare different emergency scenarios

### Execution
1. Trigger SOS
2. Speak different situations:
   - "I fell and can't get up"
   - "I'm having chest pain"
   - "I've been in an accident"
   - "I need immediate help"

### Expected Results
- ✅ AI understands each situation
- ✅ Alert shows correct understanding
- ✅ AI explains situation to contacts
- ✅ Situation is clear and accurate

### Verification
- [ ] AI understood situation correctly
- [ ] Alert message is accurate
- [ ] Contacts received correct information

---

## Test Scenario 8: Call Duration & Timing

### Setup
1. Add emergency contact
2. Prepare to monitor timing

### Execution
1. Trigger SOS
2. Note countdown start time
3. Speak situation
4. Monitor call duration

### Expected Results
- ✅ 5-second countdown before recording
- ✅ 15-second max recording time
- ✅ Processing takes 2-5 seconds
- ✅ Call connects within 10 seconds
- ✅ Timer counts up during call

### Verification
- [ ] Countdown is 5 seconds
- [ ] Recording stops at 15 seconds
- [ ] Processing completes quickly
- [ ] Call connects promptly
- [ ] Timer works correctly

---

## Test Scenario 9: UI Status Updates

### Setup
1. Add 3 emergency contacts
2. Prepare to monitor UI

### Execution
1. Trigger SOS
2. Watch Emergency Call screen
3. Monitor status changes

### Expected Results
- ✅ Status shows "Initiating"
- ✅ Changes to "Calling"
- ✅ Changes to "Speaking"
- ✅ Shows contact names and numbers
- ✅ Shows relationship
- ✅ Color-coded status (blue, green)

### Verification
- [ ] All statuses display correctly
- [ ] Colors are accurate
- [ ] Contact info is complete
- [ ] Updates happen in real-time

---

## Test Scenario 10: SMS Alerts

### Setup
1. Add emergency contacts
2. Prepare to receive SMS

### Execution
1. Trigger SOS
2. Wait for SMS alerts
3. Check phone for SMS

### Expected Results
- ✅ SMS sent after calls complete
- ✅ SMS includes emergency details
- ✅ SMS includes location link
- ✅ SMS received by all contacts

### Verification
- [ ] SMS received
- [ ] SMS content is clear
- [ ] Location link works
- [ ] All contacts received SMS

---

## Debugging Commands

### Check Emergency Contacts
```javascript
const contacts = await AsyncStorage.getItem('emergencyContacts');
console.log('Contacts:', JSON.parse(contacts));
```

### Check API Response
```javascript
const response = await fetch('http://localhost:3000/api/agents/call', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: '+919876543210',
    situation: 'Test emergency',
    context: 'Testing'
  })
});
console.log(await response.json());
```

### Check Backend Logs
```bash
# In backend folder
npm run dev
# Look for: "📞 Call placed! SID: ..."
```

### Check ngrok Status
```bash
# In terminal
ngrok http 3000
# Should show: "Forwarding https://[url].ngrok-free.dev -> http://localhost:3000"
```

---

## Common Issues & Quick Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Calls not going through | Wrong phone format | Use +91XXXXXXXXXX |
| API error 400 | Missing phone number | Add phone to contact |
| API error 503 | Backend not running | Start backend: npm run dev |
| ngrok URL error | URL expired | Restart ngrok, update .env |
| No audio from AI | Microphone issue | Check permissions |
| Call drops | Network issue | Check connection |
| Twilio error | Account issue | Check Twilio Console |

---

## Success Criteria

✅ All tests pass when:
- [ ] Calls go to correct phone numbers
- [ ] AI explains situation clearly
- [ ] Multiple contacts called simultaneously
- [ ] UI updates in real-time
- [ ] Error handling works
- [ ] SMS alerts sent
- [ ] No app crashes
- [ ] Performance is acceptable

---

## Performance Benchmarks

| Metric | Target | Actual |
|--------|--------|--------|
| SOS to call | < 10 seconds | _____ |
| Voice processing | < 5 seconds | _____ |
| API response | < 2 seconds | _____ |
| Call connection | < 5 seconds | _____ |
| UI update | < 1 second | _____ |

---

## Test Report Template

```
Date: ___________
Tester: ___________
Device: ___________
OS Version: ___________

Test Scenario: ___________
Status: ✅ PASS / ❌ FAIL

Issues Found:
- ___________
- ___________

Notes:
___________

Signature: ___________
```


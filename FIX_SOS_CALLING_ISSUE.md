# Fix: SOS Calls Not Going to Emergency Contacts

## Quick Diagnosis

If SOS calls aren't working, follow these steps in order:

### Step 1: Verify Emergency Contacts Are Saved ✅

**In Mobile App Console:**
```javascript
const contacts = await AsyncStorage.getItem('emergencyContacts');
console.log('Saved contacts:', JSON.parse(contacts));
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

**If Empty:**
- Go to HomeScreen → Contacts
- Add at least 1 emergency contact
- Verify phone number format: `+91XXXXXXXXXX`

---

### Step 2: Verify Phone Number Format ✅

**Correct Format:**
- ✅ `+919876543210` (E.164 format)
- ✅ `+1-555-123-4567` (US format)

**Incorrect Formats:**
- ❌ `9876543210` (missing country code)
- ❌ `91-9876543210` (wrong format)
- ❌ `(98) 7654-3210` (wrong format)

**Fix Phone Numbers:**
1. Go to HomeScreen → Contacts
2. Edit each contact
3. Ensure phone starts with `+` and country code
4. For India: `+91` + 10-digit number

---

### Step 3: Verify Backend is Running ✅

**In Backend Terminal:**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected
✓ Server running on port 3000
✓ Server accessible at http://localhost:3000
```

**If Error:**
- Check MongoDB connection
- Check port 3000 is not in use
- Check all dependencies installed: `npm install`

---

### Step 4: Verify ngrok is Running ✅

**In New Terminal:**
```bash
ngrok http 3000
```

**Expected Output:**
```
Forwarding https://[random-url].ngrok-free.dev -> http://localhost:3000
```

**Copy the URL** (e.g., `https://jeanmarie-auroral-mayra.ngrok-free.dev`)

---

### Step 5: Update Backend .env with ngrok URL ✅

**Edit backend/.env:**
```env
PUBLIC_URL=https://[your-ngrok-url].ngrok-free.dev
```

**Example:**
```env
PUBLIC_URL=https://jeanmarie-auroral-mayra.ngrok-free.dev
```

**Restart Backend:**
```bash
# Stop: Ctrl+C
# Start: npm run dev
```

---

### Step 6: Verify Twilio Credentials ✅

**Check backend/.env has:**
```env
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
```

**If Missing:**
1. Go to https://www.twilio.com/console
2. Copy Account SID
3. Copy Auth Token
4. Copy Twilio Phone Number
5. Add to backend/.env
6. Restart backend

---

### Step 7: Test API Endpoint ✅

**In Terminal:**
```bash
curl -X POST http://localhost:3000/api/agents/call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+919876543210",
    "situation": "Test emergency",
    "context": "Testing"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "callSid": "CA...",
  "status": "queued",
  "to": "+919876543210",
  "openingMessage": "..."
}
```

**If Error:**
- Check phone number format
- Check Twilio credentials
- Check ngrok URL is correct
- Check backend logs

---

### Step 8: Check Twilio Account ✅

**Go to https://www.twilio.com/console:**

1. **Check Balance:**
   - Account → Billing
   - Should have at least $1

2. **Verify Phone Numbers:**
   - Phone Numbers → Verified Caller IDs
   - Add emergency contact numbers

3. **Check Account Status:**
   - Should be "Active"
   - Not suspended or trial expired

---

### Step 9: Test Complete SOS Flow ✅

**In Mobile App:**

1. **Add Emergency Contact:**
   - HomeScreen → Contacts
   - Add: Name, Phone (+91XXXXXXXXXX), Relation
   - Save

2. **Trigger SOS:**
   - HomeScreen → Tap SOS button
   - Wait 5 seconds
   - Microphone auto-activates
   - Speak: "I need help"
   - Wait 15 seconds (auto-stop)

3. **Monitor:**
   - Check if phone receives call
   - Listen for AI message
   - Check Emergency Call screen status

---

## Complete Checklist

### Backend Setup
- [ ] Backend running: `npm run dev`
- [ ] MongoDB connected
- [ ] Port 3000 available
- [ ] All dependencies installed

### ngrok Setup
- [ ] ngrok running: `ngrok http 3000`
- [ ] URL copied
- [ ] URL added to backend/.env as PUBLIC_URL
- [ ] Backend restarted

### Twilio Setup
- [ ] Account SID in .env
- [ ] Auth Token in .env
- [ ] Phone Number in .env
- [ ] Account has balance
- [ ] Phone numbers verified

### Mobile Setup
- [ ] Emergency contacts added
- [ ] Phone numbers in E.164 format
- [ ] Microphone permissions granted
- [ ] Location permissions granted
- [ ] Network connection stable

### Testing
- [ ] API endpoint responds
- [ ] Phone receives test call
- [ ] AI message is clear
- [ ] Emergency Call screen shows status
- [ ] Multiple contacts called simultaneously

---

## If Still Not Working

### Check Backend Logs
```bash
# Look for these messages:
✅ "📞 Call placed! SID: ..."
❌ "❌ Call error: ..."
❌ "Set PUBLIC_URL in .env"
```

### Check Mobile Console
```javascript
// Look for these logs:
✅ "Loaded emergency contacts: 1"
✅ "Initiating AI call to Mom (+919876543210)..."
✅ "AI call initiated to Mom: CA..."
❌ "Failed to call Mom: ..."
```

### Check Twilio Console
1. Go to https://www.twilio.com/console
2. Click "Logs" → "Calls"
3. Look for recent calls
4. Check call status and error messages

### Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| "Missing: to" | No phone number | Add phone to contact |
| "Invalid phone number" | Wrong format | Use +91XXXXXXXXXX |
| "Set PUBLIC_URL in .env" | ngrok URL missing | Add ngrok URL to .env |
| "Account suspended" | Twilio issue | Check Twilio Console |
| "Insufficient balance" | No credits | Add credits to Twilio |
| "Call error: 503" | Backend not running | Start backend |

---

## Step-by-Step Video Guide

### 1. Setup Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Setup ngrok
```bash
ngrok http 3000
# Copy URL
```

### 3. Update .env
```bash
# Edit backend/.env
PUBLIC_URL=https://[your-ngrok-url].ngrok-free.dev
# Restart backend
```

### 4. Add Emergency Contact
- Mobile App → HomeScreen → Contacts
- Add contact with phone: +91XXXXXXXXXX

### 5. Test SOS
- HomeScreen → Tap SOS
- Speak emergency
- Wait for call

---

## Success Indicators

✅ **You'll know it's working when:**
1. Phone receives call from Twilio number
2. AI agent speaks the emergency situation
3. Emergency Call screen shows "Speaking" status
4. Call duration timer counts up
5. Can respond to AI agent
6. Call completes successfully

---

## Support Resources

- **Twilio Docs**: https://www.twilio.com/docs/voice
- **ngrok Docs**: https://ngrok.com/docs
- **Backend Logs**: Check terminal where `npm run dev` is running
- **Mobile Console**: React Native Debugger or Expo CLI

---

## Final Verification

Run this complete test:

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: ngrok
ngrok http 3000

# Terminal 3: Test API
curl -X POST http://localhost:3000/api/agents/call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+919876543210",
    "situation": "Test emergency",
    "context": "Testing"
  }'

# Mobile App: Trigger SOS
# HomeScreen → SOS → Speak → Wait for call
```

**If all steps complete successfully, SOS calling is working! 🎉**


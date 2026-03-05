# Emergency Calling Troubleshooting Guide

## Issue: SOS Calls Not Going to Emergency Contacts

### Root Causes & Solutions

#### 1. **Phone Number Format Issue** ❌
**Problem**: Phone numbers not in E.164 format (required by Twilio)

**Solution**: 
- Phone numbers must be in format: `+[country code][number]`
- Example: `+919876543210` (India)
- The app now automatically formats numbers:
  - 10-digit Indian numbers → `+91[number]`
  - Numbers with country code → `+[number]`

**Check**:
```javascript
// Verify phone number format in emergency contacts
// Should be: +91XXXXXXXXXX (for India)
// NOT: 9876543210 or 91-9876543210
```

#### 2. **Twilio Credentials Not Configured** ❌
**Problem**: Backend .env missing Twilio credentials

**Solution**: Ensure backend/.env has:
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
PUBLIC_URL=https://your_ngrok_url.ngrok-free.dev
```

**Important**: Never hardcode credentials in code or documentation. Always load from environment variables:
```javascript
// In your Node.js code
const twilio = require('twilio');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
```

**Check**:
```bash
# Verify credentials are loaded (don't echo actual values in production)
node -e "console.log('TWILIO_ACCOUNT_SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing')"
```

#### 3. **ngrok URL Expired** ❌
**Problem**: PUBLIC_URL in .env is outdated or expired

**Solution**:
1. Restart ngrok: `ngrok http 3000`
2. Copy new URL
3. Update backend/.env: `PUBLIC_URL=https://[new-url].ngrok-free.dev`
4. Restart backend server

**Check**:
```bash
# Test if ngrok URL is accessible
curl https://[your-ngrok-url]/health
# Should return: {"status":"ok","message":"LifeLink API is running"}
```

#### 4. **API Endpoint Not Responding** ❌
**Problem**: Backend API not receiving or processing calls

**Solution**:
1. Check backend logs for errors
2. Verify `/api/agents/call` endpoint is registered
3. Check if CallingController is loaded

**Check**:
```bash
# Test the API endpoint directly
curl -X POST https://[your-ngrok-url]/api/agents/call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+919876543210",
    "situation": "Test emergency",
    "context": "Testing"
  }'
```

#### 5. **Emergency Contacts Not Saved** ❌
**Problem**: No emergency contacts in AsyncStorage

**Solution**:
1. Go to HomeScreen
2. Tap "Contacts" in bottom navigation
3. Add at least 1 emergency contact
4. Verify contacts are saved

**Check**:
```javascript
// In React Native debugger
const contacts = await AsyncStorage.getItem('emergencyContacts');
console.log(JSON.parse(contacts));
// Should show array of contacts with name, phone, relation
```

#### 6. **Twilio Account Insufficient Balance** ❌
**Problem**: Twilio account has no credits

**Solution**:
1. Log in to Twilio Console
2. Check account balance
3. Add credits if needed
4. Verify phone number is verified

**Check**:
- Twilio Console → Account → Billing
- Verify phone number in Twilio Console

#### 7. **Phone Number Not Verified in Twilio** ❌
**Problem**: Calling to unverified numbers

**Solution**:
1. Log in to Twilio Console
2. Go to Phone Numbers → Verified Caller IDs
3. Add and verify the emergency contact numbers
4. Or upgrade to production account

**Check**:
- Twilio Console → Phone Numbers → Verified Caller IDs

#### 8. **API Call Timeout** ❌
**Problem**: Network latency or backend slow response

**Solution**:
1. Check network connection
2. Verify backend is running
3. Check backend logs for slow queries
4. Increase timeout if needed

**Check**:
```bash
# Test backend response time
time curl https://[your-ngrok-url]/health
```

### Step-by-Step Debugging

#### Step 1: Verify Emergency Contacts
```javascript
// In mobile app console
const contacts = await AsyncStorage.getItem('emergencyContacts');
console.log('Contacts:', JSON.parse(contacts));
```

#### Step 2: Check Phone Number Format
```javascript
// Phone numbers should be:
// ✅ +919876543210
// ❌ 9876543210
// ❌ 91-9876543210
// ❌ (98) 7654-3210
```

#### Step 3: Test API Endpoint
```bash
# From terminal
curl -X POST http://localhost:3000/api/agents/call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+919876543210",
    "situation": "Test emergency",
    "context": "Testing"
  }'
```

#### Step 4: Check Backend Logs
```bash
# Look for:
# ✅ "📞 Call placed! SID: ..."
# ❌ "❌ Call error: ..."
# ❌ "Set PUBLIC_URL in .env"
```

#### Step 5: Verify Twilio Credentials
```bash
# In backend/.env - credentials are loaded from environment variables
# Never hardcode credentials in documentation or code
# Access them in your code like this:

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const publicUrl = process.env.PUBLIC_URL;

// Verify they're loaded:
console.log('Twilio Account SID:', accountSid ? '✅ Loaded' : '❌ Missing');
console.log('Twilio Auth Token:', authToken ? '✅ Loaded' : '❌ Missing');
console.log('Twilio Phone Number:', phoneNumber ? '✅ Loaded' : '❌ Missing');
console.log('Public URL:', publicUrl ? '✅ Loaded' : '❌ Missing');
```

### Common Error Messages & Solutions

#### Error: "Missing: to (e.g. +91XXXXXXXXXX)"
**Cause**: Phone number not provided or in wrong format
**Fix**: Ensure phone number is in E.164 format: `+91XXXXXXXXXX`

#### Error: "Set PUBLIC_URL in .env (ngrok URL)"
**Cause**: PUBLIC_URL not configured
**Fix**: Add ngrok URL to backend/.env

#### Error: "Call error: Invalid phone number"
**Cause**: Phone number format invalid for Twilio
**Fix**: Use E.164 format: `+[country code][number]`

#### Error: "Call error: Account suspended"
**Cause**: Twilio account issue
**Fix**: Check Twilio Console for account status

#### Error: "Call error: Insufficient balance"
**Cause**: No credits in Twilio account
**Fix**: Add credits to Twilio account

### Verification Checklist

- [ ] Emergency contacts added in app
- [ ] Phone numbers in E.164 format (+91XXXXXXXXXX)
- [ ] Twilio credentials in backend/.env
- [ ] ngrok URL is current and accessible
- [ ] Backend server is running
- [ ] Twilio account has sufficient balance
- [ ] Phone numbers are verified in Twilio
- [ ] Network connection is stable
- [ ] API endpoint `/api/agents/call` is working

### Testing the Complete Flow

1. **Add Emergency Contact**
   - Open app → Contacts → Add contact
   - Phone: +919876543210
   - Name: Test Contact

2. **Trigger SOS**
   - HomeScreen → Tap SOS button
   - Wait 5 seconds
   - Microphone auto-activates
   - Speak: "I need help"
   - Wait for processing

3. **Monitor Logs**
   - Check mobile console for API calls
   - Check backend logs for call initiation
   - Check Twilio Console for call status

4. **Verify Call**
   - Check if phone received call
   - Listen for AI message
   - Respond to AI agent

### Emergency Contact Format

**Correct Format**:
```json
{
  "name": "Mom",
  "phone": "+919876543210",
  "relation": "Mother"
}
```

**Incorrect Formats** ❌:
```json
{
  "name": "Mom",
  "phone": "9876543210"  // Missing +91
}

{
  "name": "Mom",
  "phone": "91-9876543210"  // Wrong format
}

{
  "name": "Mom",
  "phone": "(98) 7654-3210"  // Wrong format
}
```

### Quick Fix Checklist

If calls aren't working:

1. ✅ Verify phone numbers are `+91XXXXXXXXXX` format
2. ✅ Restart backend server
3. ✅ Update ngrok URL in .env
4. ✅ Check Twilio account balance
5. ✅ Verify phone numbers in Twilio Console
6. ✅ Check network connection
7. ✅ Clear app cache and restart
8. ✅ Check backend logs for errors

### Support

If issues persist:
1. Check backend logs: `npm run dev` (in backend folder)
2. Check mobile console: React Native Debugger
3. Check Twilio Console: https://www.twilio.com/console
4. Verify ngrok is running: `ngrok http 3000`


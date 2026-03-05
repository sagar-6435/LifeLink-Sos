# LifeLink AI Emergency System - Testing Guide

## System Status ✅

All three emergency layers are **FULLY IMPLEMENTED** and ready for testing:

### ✅ Layer 1: AI Guidance Chatbot
- **File**: `mobile/src/components/ChatbotButton.js`
- **Status**: Implemented
- **Features**: First-aid instructions, emergency assessment, multi-language support

### ✅ Layer 2: AI Emergency Calling System
- **File**: `mobile/src/screens/EmergencyCallScreen.js`
- **Status**: Implemented
- **Features**: Simultaneous AI calls to all contacts, natural conversation, real-time status

### ✅ Layer 3: SMS Alert System
- **File**: `backend/agents/MessagingController.js`
- **Status**: Implemented
- **Features**: Bulk SMS, location sharing, immediate context delivery

---

## Prerequisites

Before testing, ensure you have:

1. **Backend Dependencies Installed**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Variables Configured**
   - Copy `.env.example` to `.env`
   - Add your API keys (see Configuration section below)

3. **Mobile Dependencies Installed**
   ```bash
   cd mobile
   npm install
   ```

---

## Configuration Steps

### 1. Minimum Setup (Chatbot Only)

To test Layer 1 (Chatbot) only:

```env
# backend/.env
GITHUB_TOKEN=ghp_your_token_here
MONGODB_URI=mongodb://localhost:27017/lifelink
JWT_SECRET=your_secret_key
PORT=3000
```

**Get GitHub Token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `read:org`
4. Copy token to `.env`

### 2. Full Setup (All Layers)

To test all three layers:

```env
# backend/.env
# AI Model
GITHUB_TOKEN=ghp_your_token_here

# Twilio (for calls & SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Public URL (ngrok)
PUBLIC_URL=https://your-ngrok-url.ngrok.io

# Azure Speech (optional)
AZURE_SPEECH_KEY=your_key
AZURE_SPEECH_REGION=eastus
AZURE_ENDPOINT=https://eastus.api.cognitive.microsoft.com/

# Database
MONGODB_URI=mongodb://localhost:27017/lifelink
JWT_SECRET=your_secret_key
PORT=3000
```

**Get Twilio Credentials:**
1. Sign up at https://www.twilio.com/try-twilio
2. Get $15 free trial credit
3. From console:
   - Copy Account SID
   - Copy Auth Token
   - Buy a phone number with Voice & SMS

**Setup Ngrok:**
1. Install: https://ngrok.com/download
2. Run: `ngrok http 3000`
3. Copy HTTPS URL to `PUBLIC_URL`
4. Keep ngrok running during tests

---

## Testing Procedures

### Test 1: Backend Health Check

```bash
# Start backend
cd backend
npm run dev

# In another terminal, test health endpoint
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "message": "LifeLink API is running"
}
```

---

### Test 2: Layer 1 - AI Guidance Chatbot

#### A. Test via API (Backend)

```bash
curl -X POST http://localhost:3000/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Someone is choking, what do I do?",
    "history": []
  }'
```

**Expected Response:**
```json
{
  "reply": "Call 108 immediately. Perform Heimlich maneuver: Stand behind them, make a fist above navel, thrust inward and upward sharply. Repeat until object dislodges.",
  "detectedInputLang": { "code": "en-IN", "name": "English" },
  "replyLang": { "code": "en-IN", "name": "English" },
  "emergencyTriggered": true,
  "emergencyActions": { ... }
}
```

#### B. Test via Mobile App

1. **Start Mobile App:**
   ```bash
   cd mobile
   npm start
   ```

2. **Open App** on device/emulator

3. **Find Chatbot Button:**
   - Look for blue floating button (bottom-right)
   - Icon: Robot 🤖

4. **Test Conversations:**

   **Test Case 1: First Aid Guidance**
   - User: "Someone is bleeding heavily"
   - Expected: Step-by-step bleeding control instructions
   - Should mention: Apply pressure, elevate, call 108

   **Test Case 2: Emergency Assessment**
   - User: "Is chest pain serious?"
   - Expected: Guidance on heart attack symptoms
   - Should mention: Call 108, aspirin, rest

   **Test Case 3: Multi-Language**
   - User: "సహాయం" (Telugu for "help")
   - Expected: Response in Telugu script
   - Should detect language automatically

   **Test Case 4: Emergency Detection**
   - User: "Help! Someone fell and is unconscious"
   - Expected: 
     - Immediate first-aid instructions
     - `emergencyTriggered: true` in response
     - Alert notification shown

5. **Verify Features:**
   - ✅ Messages appear in chat bubbles
   - ✅ Loading indicator shows while AI thinks
   - ✅ Quick action buttons work
   - ✅ Conversation history maintained
   - ✅ Timestamps displayed correctly

---

### Test 3: Layer 2 - AI Emergency Calling

#### A. Test Single AI Call (Backend)

```bash
curl -X POST http://localhost:3000/api/agents/call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+917330873455",
    "situation": "Person fell and is injured at location 17.385044, 78.486671",
    "context": "Emergency contact - friend"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "callSid": "CAxxxxxxxxxxxxx",
  "status": "queued",
  "to": "+917330873455",
  "openingMessage": "Hello, this is LifeLink Emergency Service..."
}
```

**What Happens:**
1. Phone receives call from Twilio number
2. AI speaks opening message
3. AI listens for response
4. AI continues conversation naturally
5. AI ends call when contact confirms help

#### B. Test via Mobile App (Full Emergency Flow)

1. **Setup Emergency Contacts:**
   - Go to Contacts tab
   - Add 2-3 test contacts
   - Use your own phone numbers for testing

2. **Trigger SOS:**
   - Go to Home screen
   - Press red SOS button
   - Confirm emergency

3. **Watch Emergency Screen:**
   - Should show "EMERGENCY CALL" header
   - Timer starts counting
   - Call sequence shows:
     - ✓ Emergency Services - Completed
     - 🤖 AI Calling Contacts - In Progress
     - ✓ SMS Alerts - Completed

4. **Verify AI Calls:**
   - Each contact's phone should ring
   - AI introduces itself
   - AI explains emergency
   - AI answers questions
   - AI ends gracefully

5. **Check Call Status:**
   - Screen shows individual call status:
     - "John Doe (+917330873455) - AI Speaking"
     - "Jane Smith (+919876543210) - Connected"
   - Status updates in real-time

6. **Expected Timeline:**
   - 0-2s: Emergency services called
   - 2-5s: AI calls initiated to all contacts
   - 5-10s: All contacts receiving calls
   - 10-15s: SMS alerts sent

---

### Test 4: Layer 3 - SMS Alert System

#### A. Test Single SMS (Backend)

```bash
curl -X POST http://localhost:3000/api/agents/message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+917330873455",
    "situation": "Emergency alert from John. Location: 17.385044, 78.486671. Immediate assistance required.",
    "recipientName": "Jane"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "messageSid": "SMxxxxxxxxxxxxx",
  "status": "queued",
  "to": "+917330873455",
  "body": "LifeLink Emergency Alert: John needs immediate help at location 17.385044, 78.486671. Please respond urgently."
}
```

#### B. Test Bulk SMS (Backend)

```bash
curl -X POST http://localhost:3000/api/agents/message/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "recipients": [
      {"to": "+917330873455", "recipientName": "John"},
      {"to": "+919876543210", "recipientName": "Jane"}
    ],
    "situation": "Emergency alert. Location: 17.385044, 78.486671. Immediate assistance required."
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "sent": [
    {"to": "+917330873455", "messageSid": "SMxxx1", "status": "queued"},
    {"to": "+919876543210", "messageSid": "SMxxx2", "status": "queued"}
  ],
  "failed": [],
  "total": 2
}
```

#### C. Test via Mobile App

SMS alerts are automatically sent when SOS is triggered (Test 3B above).

**Verify:**
1. All emergency contacts receive SMS
2. SMS includes:
   - "LifeLink Emergency Alert"
   - Situation description
   - Location coordinates
   - Urgency message
3. SMS arrives within 5-10 seconds

---

## Integration Test: Complete Emergency Flow

This tests all three layers working together:

### Scenario: Car Accident

1. **User witnesses accident**
   - Opens mobile app
   - Taps blue chatbot button

2. **Layer 1: Chatbot Guidance**
   - User: "There's been a car accident, what do I do?"
   - Chatbot: "Call 108 immediately. Check if safe to approach. Don't move injured people unless there's fire or danger. Check for breathing and bleeding."
   - User follows guidance

3. **Situation worsens**
   - User presses SOS button
   - Emergency screen appears

4. **Layer 2: AI Calling**
   - AI agents call all 3 emergency contacts simultaneously
   - Each contact receives call within 10 seconds
   - AI explains: "Hello, this is LifeLink Emergency Service. I'm calling about [User]. They triggered an emergency alert at [location]. They need immediate assistance."
   - Contacts confirm they're coming

5. **Layer 3: SMS Backup**
   - All contacts receive SMS
   - SMS includes location and situation
   - Provides immediate context

6. **User continues with chatbot**
   - User: "Person is bleeding from head"
   - Chatbot: "Apply firm pressure with clean cloth. Don't remove cloth if it soaks through, add more on top. Keep person still. Help is on the way."

### Expected Results:
- ✅ Chatbot provides immediate guidance
- ✅ All contacts called within 15 seconds
- ✅ All contacts receive SMS
- ✅ User has continuous support via chatbot
- ✅ Response time reduced from 3-5 minutes to 10-15 seconds

---

## Troubleshooting

### Issue: Chatbot not responding

**Symptoms:**
- "Service not available" error
- No response from chatbot

**Solutions:**
1. Check `GITHUB_TOKEN` is valid
2. Verify backend is running: `curl http://localhost:3000/health`
3. Check server logs for errors
4. Test API directly with curl

### Issue: AI calls not connecting

**Symptoms:**
- Calls show "failed" status
- No phone rings

**Solutions:**
1. Verify Twilio credentials in `.env`
2. Check phone numbers are in E.164 format (+1234567890)
3. Ensure ngrok is running: `ngrok http 3000`
4. Verify `PUBLIC_URL` matches ngrok URL exactly
5. Check Twilio console for error logs
6. For trial accounts: verify recipient numbers in Twilio console

### Issue: SMS not sending

**Symptoms:**
- SMS status shows "failed"
- No messages received

**Solutions:**
1. Verify Twilio credentials
2. Check phone has SMS capability
3. For trial accounts: verify recipient numbers
4. Check Twilio console for delivery status

### Issue: "Cannot connect to backend"

**Symptoms:**
- Mobile app shows connection errors
- API requests fail

**Solutions:**
1. Check backend is running: `npm run dev`
2. Verify `API_URL` in `mobile/src/config/api.js`
3. For local testing: Use `DEVELOPMENT_API_URL`
4. For production: Use `PRODUCTION_API_URL`
5. Check firewall/network settings

---

## Performance Metrics

Track these metrics during testing:

### Layer 1: Chatbot
- Response time: < 2 seconds
- Accuracy: Emergency detection rate
- Language detection: Correct language identification

### Layer 2: AI Calling
- Time to first call: < 5 seconds
- Simultaneous calls: All contacts called at once
- Call success rate: % of calls connected
- Average call duration: 30-60 seconds

### Layer 3: SMS
- Delivery time: < 10 seconds
- Delivery rate: % of SMS delivered
- Message clarity: Recipient understands situation

### Overall System
- Total response time: < 15 seconds (all contacts notified)
- System reliability: Uptime and error rate
- User satisfaction: Feedback from test users

---

## Test Checklist

Use this checklist to verify all features:

### Backend
- [ ] Server starts without errors
- [ ] Health endpoint responds
- [ ] MongoDB connected
- [ ] All environment variables set

### Layer 1: Chatbot
- [ ] Chatbot button visible on home screen
- [ ] Chat modal opens/closes
- [ ] Messages send and receive
- [ ] AI responses are relevant
- [ ] Emergency detection works
- [ ] Multi-language support works
- [ ] Quick actions work
- [ ] Loading indicator shows

### Layer 2: AI Calling
- [ ] SOS button triggers emergency
- [ ] Emergency screen appears
- [ ] Timer starts
- [ ] Emergency services called
- [ ] AI calls initiated to all contacts
- [ ] Call status updates in real-time
- [ ] Individual contact status shown
- [ ] Calls connect successfully
- [ ] AI speaks opening message
- [ ] AI handles conversation
- [ ] AI ends call gracefully

### Layer 3: SMS
- [ ] SMS sent to all contacts
- [ ] SMS includes situation
- [ ] SMS includes location
- [ ] SMS delivered successfully
- [ ] Bulk SMS works
- [ ] Status tracking works

### Integration
- [ ] All three layers work together
- [ ] Emergency flow is smooth
- [ ] No delays or errors
- [ ] User experience is seamless

---

## Next Steps After Testing

1. **Production Deployment:**
   - Deploy backend to cloud (Render, Heroku, AWS)
   - Update `API_URL` in mobile app
   - Build production APK

2. **Monitoring:**
   - Set up error tracking (Sentry)
   - Monitor API usage
   - Track Twilio costs

3. **Optimization:**
   - Add caching for faster responses
   - Optimize AI prompts
   - Reduce API calls

4. **Enhancements:**
   - Add voice input to chatbot
   - Video calls to contacts
   - Live location sharing
   - Medical history integration

---

## Support

If you encounter issues:

1. Check this testing guide
2. Review documentation files:
   - `AGENTS_INTEGRATION_GUIDE.md`
   - `EMERGENCY_AI_CALLING.md`
   - `AGENTS_SUMMARY.md`
3. Check backend logs: `npm run dev`
4. Check Twilio console: https://console.twilio.com
5. Test with curl commands first

---

## Summary

Your LifeLink AI Emergency System is **FULLY IMPLEMENTED** with:

✅ **Layer 1: AI Guidance Chatbot** - Provides first-aid instructions and emergency assessment  
✅ **Layer 2: AI Emergency Calling** - Calls all contacts simultaneously with natural conversation  
✅ **Layer 3: SMS Alert System** - Sends location and alerts to all contacts  

All three layers are integrated and ready for testing. Follow this guide to verify each component works correctly.

**Start with the minimum setup (chatbot only) and gradually add Twilio for full functionality.**

Good luck with testing! 🚑

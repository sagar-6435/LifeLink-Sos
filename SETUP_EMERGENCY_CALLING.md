# Complete Setup Guide - Emergency Calling System

## Prerequisites

- Node.js 14+ installed
- npm or yarn
- Twilio account (free trial works)
- ngrok installed
- MongoDB connection
- Mobile device or emulator

## Step 1: Backend Setup

### 1.1 Install Dependencies
```bash
cd backend
npm install
```

### 1.2 Configure Environment Variables

**Create/Edit backend/.env:**
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://[username]:[password]@[cluster].mongodb.net/lifelink?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-secret-key-here

# AI/LLM
GROQ_API_KEY=your-groq-api-key
OPENAI_API_KEY=your-openai-api-key

# Twilio (Get from https://www.twilio.com/console)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token-here
TWILIO_PHONE_NUMBER=+1234567890

# Emergency Fallback
EMERGENCY_CONTACT_NUMBER=+919876543210

# ngrok (Will be updated after starting ngrok)
PUBLIC_URL=https://your-ngrok-url.ngrok-free.dev

# Azure Speech
AZURE_SPEECH_KEY=your-azure-key
AZURE_SPEECH_REGION=eastus
AZURE_ENDPOINT=https://eastus.api.cognitive.microsoft.com/
```

### 1.3 Get Twilio Credentials

1. Go to https://www.twilio.com/console
2. Copy **Account SID** → Add to TWILIO_ACCOUNT_SID
3. Copy **Auth Token** → Add to TWILIO_AUTH_TOKEN
4. Go to **Phone Numbers** → Copy your Twilio number → Add to TWILIO_PHONE_NUMBER
5. Add credits to account (at least $1)

### 1.4 Start Backend Server
```bash
npm run dev
```

**Expected Output:**
```
✓ MongoDB connected
✓ Server running on port 3000
✓ Server accessible at http://localhost:3000
```

---

## Step 2: ngrok Setup

### 2.1 Install ngrok
```bash
# macOS
brew install ngrok

# Windows
choco install ngrok

# Or download from https://ngrok.com/download
```

### 2.2 Start ngrok
```bash
ngrok http 3000
```

**Expected Output:**
```
Forwarding https://abc123def456.ngrok-free.dev -> http://localhost:3000
```

### 2.3 Copy ngrok URL
```
https://abc123def456.ngrok-free.dev
```

### 2.4 Update Backend .env
```env
PUBLIC_URL=https://abc123def456.ngrok-free.dev
```

### 2.5 Restart Backend
```bash
# Stop: Ctrl+C
# Start: npm run dev
```

---

## Step 3: Mobile App Setup

### 3.1 Install Dependencies
```bash
cd mobile
npm install
```

### 3.2 Configure API URL

**Edit mobile/src/config/api.js:**
```javascript
export const API_URL = 'http://localhost:3000';
// For testing on device, use:
// export const API_URL = 'http://10.0.2.2:3000'; // Android emulator
// export const API_URL = 'http://localhost:3000'; // iOS simulator
```

### 3.3 Start Mobile App
```bash
npm start
# or
expo start
```

### 3.4 Run on Device/Emulator
```bash
# iOS
i

# Android
a

# Web
w
```

---

## Step 4: Add Emergency Contacts

### 4.1 In Mobile App
1. Open app and login
2. Go to **HomeScreen**
3. Tap **Contacts** in bottom navigation
4. Tap **+ Manual** or **Import from Phone**
5. Add contact:
   - **Name**: Mom
   - **Phone**: +919876543210 (E.164 format)
   - **Relation**: Mother
6. Tap **Add Contact**
7. Repeat for 2-3 contacts

### 4.2 Verify Contacts Saved
```javascript
// In React Native Debugger console
const contacts = await AsyncStorage.getItem('emergencyContacts');
console.log(JSON.parse(contacts));
```

**Expected Output:**
```json
[
  {
    "name": "Mom",
    "phone": "+919876543210",
    "relation": "Mother"
  },
  {
    "name": "Dad",
    "phone": "+919876543211",
    "relation": "Father"
  }
]
```

---

## Step 5: Test Emergency Calling

### 5.1 Test API Endpoint
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

### 5.2 Test SOS Flow
1. Open mobile app
2. Go to **HomeScreen**
3. Tap **SOS** button
4. Wait 5 seconds (countdown)
5. Microphone auto-activates
6. Speak: "I need help"
7. Wait 15 seconds (auto-stop)
8. AI processes audio
9. Alert shows understood situation
10. Emergency Call screen appears
11. Check if phone receives call

### 5.3 Monitor Logs

**Backend Terminal:**
```
📞 Call placed! SID: CA...
```

**Mobile Console:**
```
Loaded emergency contacts: 2
Initiating AI call to Mom (+919876543210)...
✅ AI call initiated to Mom: CA...
```

---

## Step 6: Verify Twilio Setup

### 6.1 Check Account Balance
1. Go to https://www.twilio.com/console
2. Click **Account** → **Billing**
3. Should show balance (at least $1)

### 6.2 Verify Phone Numbers
1. Go to https://www.twilio.com/console
2. Click **Phone Numbers** → **Verified Caller IDs**
3. Add emergency contact numbers
4. Verify via SMS

### 6.3 Check Call Logs
1. Go to https://www.twilio.com/console
2. Click **Logs** → **Calls**
3. Should see recent calls
4. Check call status and duration

---

## Configuration Checklist

### Backend
- [ ] Node.js installed
- [ ] Dependencies installed: `npm install`
- [ ] MongoDB connected
- [ ] .env file created with all variables
- [ ] Twilio credentials added
- [ ] Server running: `npm run dev`
- [ ] Port 3000 available

### ngrok
- [ ] ngrok installed
- [ ] ngrok running: `ngrok http 3000`
- [ ] URL copied
- [ ] URL added to backend/.env
- [ ] Backend restarted

### Mobile
- [ ] Node.js installed
- [ ] Dependencies installed: `npm install`
- [ ] API_URL configured
- [ ] App running: `npm start`
- [ ] Permissions granted (microphone, location)

### Twilio
- [ ] Account created
- [ ] Account SID copied
- [ ] Auth Token copied
- [ ] Phone number copied
- [ ] Account has balance
- [ ] Phone numbers verified

### Testing
- [ ] Emergency contacts added
- [ ] Phone numbers in E.164 format
- [ ] API endpoint responds
- [ ] Phone receives test call
- [ ] AI message is clear

---

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 3000 is in use
lsof -i :3000

# Kill process using port 3000
kill -9 <PID>

# Try different port
PORT=3001 npm run dev
```

### MongoDB Connection Error
```bash
# Check MongoDB URI in .env
# Verify credentials are correct
# Check if MongoDB is running
# Try local MongoDB: mongodb://localhost:27017/lifelink
```

### ngrok URL Expired
```bash
# Restart ngrok
ngrok http 3000

# Copy new URL
# Update backend/.env
# Restart backend
```

### Twilio Credentials Invalid
```bash
# Go to https://www.twilio.com/console
# Copy Account SID again
# Copy Auth Token again
# Update .env
# Restart backend
```

### Calls Not Going Through
```bash
# Check phone number format: +91XXXXXXXXXX
# Check Twilio account balance
# Check Twilio Console for errors
# Check backend logs
# Check mobile console logs
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| MONGODB_URI | MongoDB connection | mongodb+srv://... |
| JWT_SECRET | JWT secret key | random-string |
| GROQ_API_KEY | Groq API key | gsk_... |
| OPENAI_API_KEY | OpenAI API key | sk-... |
| TWILIO_ACCOUNT_SID | Twilio account ID | AC... |
| TWILIO_AUTH_TOKEN | Twilio auth token | ... |
| TWILIO_PHONE_NUMBER | Twilio phone | +1... |
| EMERGENCY_CONTACT_NUMBER | Fallback number | +91... |
| PUBLIC_URL | ngrok URL | https://...ngrok... |
| AZURE_SPEECH_KEY | Azure speech key | ... |
| AZURE_SPEECH_REGION | Azure region | eastus |

---

## Quick Start Commands

```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: ngrok
ngrok http 3000

# Terminal 3: Mobile
cd mobile
npm install
npm start

# Terminal 4: Test API
curl -X POST http://localhost:3000/api/agents/call \
  -H "Content-Type: application/json" \
  -d '{"to":"+919876543210","situation":"Test","context":"Testing"}'
```

---

## Success Indicators

✅ **System is working when:**
1. Backend server starts without errors
2. ngrok shows forwarding URL
3. Mobile app connects to backend
4. Emergency contacts are saved
5. API endpoint responds with callSid
6. Phone receives call from Twilio number
7. AI agent speaks the emergency situation
8. Emergency Call screen shows "Speaking" status
9. Call duration timer counts up
10. Call completes successfully

---

## Next Steps

1. ✅ Complete setup following this guide
2. ✅ Test with single emergency contact
3. ✅ Test with multiple contacts
4. ✅ Test voice recognition
5. ✅ Test error handling
6. ✅ Deploy to production

---

## Support

- **Twilio Docs**: https://www.twilio.com/docs/voice
- **ngrok Docs**: https://ngrok.com/docs
- **MongoDB Docs**: https://docs.mongodb.com
- **React Native Docs**: https://reactnative.dev/docs


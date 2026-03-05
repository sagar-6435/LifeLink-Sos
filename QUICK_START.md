# LifeLink AI Emergency System - Quick Start

## 🚀 Get Started in 5 Minutes

Your three-layer emergency AI system is fully implemented and ready to use!

---

## Step 1: Install Dependencies (2 minutes)

```bash
# Backend
cd backend
npm install

# Mobile (in another terminal)
cd mobile
npm install
```

---

## Step 2: Configure Environment (2 minutes)

### Minimum Setup (Chatbot Only)

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add:

```env
GITHUB_TOKEN=ghp_your_token_here
MONGODB_URI=mongodb://localhost:27017/lifelink
JWT_SECRET=my_secret_key_123
PORT=3000
```

**Get GitHub Token (30 seconds):**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select: `repo`, `read:org`
4. Copy token to `.env`

---

## Step 3: Start Backend (30 seconds)

```bash
cd backend
npm run dev
```

You should see:
```
✓ MongoDB connected
✓ Server running on port 3000
```

---

## Step 4: Test Chatbot (30 seconds)

### Option A: Test via API

```bash
curl -X POST http://localhost:3000/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Someone is choking, what do I do?", "history": []}'
```

### Option B: Test via Mobile App

```bash
cd mobile
npm start
```

1. Open app on device/emulator
2. Tap blue chatbot button (bottom-right)
3. Type: "Someone is bleeding, what do I do?"
4. Get instant first-aid instructions!

---

## ✅ You're Done!

Layer 1 (AI Guidance Chatbot) is now working!

---

## Want Full Features? Add Twilio (Optional)

To enable Layer 2 (AI Calling) and Layer 3 (SMS Alerts):

### 1. Get Twilio Account (2 minutes)

1. Sign up: https://www.twilio.com/try-twilio
2. Get $15 free credit
3. Copy from console:
   - Account SID
   - Auth Token
4. Buy a phone number with Voice & SMS

### 2. Setup Ngrok (1 minute)

```bash
# Install ngrok
# Download from: https://ngrok.com/download

# Run ngrok
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

### 3. Update .env

Add to `backend/.env`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
PUBLIC_URL=https://abc123.ngrok.io
```

### 4. Test AI Calling

```bash
curl -X POST http://localhost:3000/api/agents/call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+917330873455",
    "situation": "Person fell and is injured",
    "context": "Emergency contact - friend"
  }'
```

Your phone will ring with an AI agent!

---

## System Overview

### Layer 1: AI Guidance Chatbot ✅
- **Location**: Blue button on home screen
- **Purpose**: First-aid instructions, emergency guidance
- **Status**: Working now!

### Layer 2: AI Emergency Calling 🔧
- **Location**: Automatic when SOS pressed
- **Purpose**: Call all contacts simultaneously
- **Requires**: Twilio + ngrok

### Layer 3: SMS Alert System 🔧
- **Location**: Automatic when SOS pressed
- **Purpose**: Send location + alert to contacts
- **Requires**: Twilio

---

## Test Emergency Flow

1. **Add Emergency Contacts** in app
2. **Press SOS button** on home screen
3. **Watch magic happen:**
   - Emergency services called
   - AI calls all contacts at once
   - SMS sent to everyone
   - All in 10-15 seconds!

---

## Common Issues

### "Service not available"
- Check backend is running: `npm run dev`
- Verify `GITHUB_TOKEN` in `.env`

### "Cannot connect"
- Check `API_URL` in `mobile/src/config/api.js`
- For local testing: Use `http://10.239.103.96:3000`

### Calls not working
- Ensure ngrok is running
- Verify `PUBLIC_URL` matches ngrok URL
- Check Twilio credentials

---

## What's Implemented?

✅ **ChatbotButton.js** - AI chatbot with first-aid guidance  
✅ **EmergencyCallScreen.js** - AI calling system with real-time status  
✅ **MessagingController.js** - SMS alert system  
✅ **ChatController.js** - Emergency detection and guidance  
✅ **CallingController.js** - AI voice conversation  
✅ **agent.js** - Core AI integration  

**Everything is ready to use!**

---

## Next Steps

1. ✅ Test chatbot (working now!)
2. 🔧 Add Twilio for AI calling (optional)
3. 🔧 Add Twilio for SMS alerts (optional)
4. 🚀 Deploy to production
5. 📱 Build APK for distribution

---

## Documentation

- **TESTING_GUIDE.md** - Comprehensive testing procedures
- **AGENTS_INTEGRATION_GUIDE.md** - Complete setup guide
- **EMERGENCY_AI_CALLING.md** - AI calling system details
- **AGENTS_SUMMARY.md** - System overview

---

## Support

Need help? Check:
1. `TESTING_GUIDE.md` for detailed testing
2. Backend logs: `npm run dev`
3. Twilio console: https://console.twilio.com

---

## 🎉 Congratulations!

You now have a working AI emergency response system!

**Start with the chatbot, then add calling when ready.**

Stay safe! 🚑

# LifeLink AI Agents Integration Guide

## Overview

The AI agents have been successfully integrated into your LifeLink project. This system provides intelligent emergency response capabilities including:

- **AI Chat Assistant**: Multi-language emergency guidance with automatic emergency detection
- **Voice Calling Agent**: AI-powered calls to emergency contacts
- **SMS Messaging Agent**: Automated emergency alerts via SMS

## What Was Added

### Backend Changes

1. **New Folder**: `backend/agents/`
   - `agent.js` - Core AI model integration
   - `ChatController.js` - Chat and speech services
   - `CallingController.js` - Voice call management
   - `MessagingController.js` - SMS messaging
   - `README.md` - Detailed documentation

2. **New Route**: `backend/routes/agents.js`
   - Exposes all agent endpoints under `/api/agents`

3. **Updated Files**:
   - `backend/server.js` - Added agents route
   - `backend/package.json` - Added new dependencies
   - `backend/.env.example` - Added required environment variables

### Mobile Changes

1. **Updated Screen**: `mobile/src/screens/EmergencyCallScreen.js`
   - Integrated AI calling agent for simultaneous emergency calls
   - Real-time call status tracking for each contact
   - Automated SMS alerts to all contacts
   - Visual indicators for AI call progress

2. **Chatbot Component**: `mobile/src/components/ChatbotButton.js`
   - Provides real-time emergency guidance and first-aid instructions
   - Helps users assess emergency situations
   - Multi-language support for emergency instructions
   - Can detect emergency keywords and provide immediate guidance

## Setup Instructions

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

Or use the setup script:

**Windows:**
```bash
setup-agents.bat
```

**Linux/Mac:**
```bash
chmod +x setup-agents.sh
./setup-agents.sh
```

### Step 2: Configure Environment Variables

Copy the example file:
```bash
cp .env.example .env
```

Edit `backend/.env` and add your API keys:

```env
# AI Agent Configuration
GITHUB_TOKEN=ghp_your_github_token_here

# Twilio Configuration (for calling and SMS)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
PUBLIC_URL=https://your-ngrok-url.ngrok.io

# Azure Speech Services (for text-to-speech)
AZURE_SPEECH_KEY=your_azure_key
AZURE_SPEECH_REGION=eastus
AZURE_ENDPOINT=https://eastus.api.cognitive.microsoft.com/
```

### Step 3: Get API Keys

#### 1. GitHub Token (Required for AI)
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `read:org`
4. Generate and copy the token
5. Add to `.env` as `GITHUB_TOKEN`

#### 2. Twilio (Required for Calls & SMS)
1. Sign up at https://www.twilio.com/try-twilio
2. Get free trial credits ($15)
3. From console dashboard:
   - Copy Account SID → `TWILIO_ACCOUNT_SID`
   - Copy Auth Token → `TWILIO_AUTH_TOKEN`
4. Get a phone number:
   - Go to Phone Numbers → Buy a Number
   - Choose a number with Voice & SMS capabilities
   - Add to `.env` as `TWILIO_PHONE_NUMBER` (format: +1234567890)

#### 3. Azure Speech Services (Required for TTS)
1. Create Azure account at https://azure.microsoft.com/free
2. Create a Speech Service:
   - Search "Speech Services" in Azure Portal
   - Click Create
   - Choose Free tier (F0)
   - Select region (e.g., East US)
3. Get credentials:
   - Go to Keys and Endpoint
   - Copy Key 1 → `AZURE_SPEECH_KEY`
   - Copy Region → `AZURE_SPEECH_REGION`
   - Copy Endpoint → `AZURE_ENDPOINT`

#### 4. Ngrok (Required for Twilio Webhooks)
1. Install ngrok: https://ngrok.com/download
2. Sign up for free account
3. Run: `ngrok http 3000`
4. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
5. Add to `.env` as `PUBLIC_URL`

**Important**: Keep ngrok running while testing calls!

### Step 4: Start the Backend

```bash
cd backend
npm run dev
```

You should see:
```
✓ MongoDB connected
✓ Server running on port 3000
```

### Step 5: Test the Integration

#### Test Chat Agent
```bash
curl -X POST http://localhost:3000/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I need help", "history": []}'
```

#### Test from Mobile App
1. Start the mobile app: `cd mobile && npm start`
2. Open the app on your device/emulator
3. Tap the blue chatbot button (bottom-right)
4. Type a message and send
5. You should get an AI response

## Features

### 1. AI-Powered Emergency Calling (Primary Feature)

When a user triggers an SOS alert, the system:
- Calls local emergency services (108, 100, etc.)
- **Simultaneously calls ALL emergency contacts using AI agents**
- Each AI agent has a natural conversation with the contact
- Informs them of the emergency situation and location
- Answers their questions in real-time
- Supports multiple languages

**Key Benefit**: Instead of calling contacts one by one (which wastes precious time), AI agents call everyone at once, dramatically reducing response time in emergencies.

### 2. Emergency Guidance Chatbot (Critical Support Feature)

The chatbot provides real-time emergency guidance:
- **First-aid instructions**: CPR, bleeding control, choking, burns, etc.
- **Emergency assessment**: Helps users determine severity
- **Step-by-step guidance**: Clear instructions during crisis
- **Multi-language support**: English, Telugu, Tamil, Hindi, Kannada
- **Calm, authoritative tone**: Reduces panic, provides confidence
- **Context-aware**: Remembers conversation for follow-up questions

**Use Cases**:
- "My friend is choking, what do I do?"
- "Someone had a heart attack, how do I help?"
- "There's been a car accident, what should I do first?"
- "How do I stop heavy bleeding?"

### 3. Automated SMS Alerts

Sends AI-generated emergency SMS to all contacts:
- Includes situation details
- Location information
- Immediate assistance request
- Delivery tracking

## API Endpoints

All endpoints are under `/api/agents`:

### Chat
- `POST /api/agents/chat` - Send message to AI
- `POST /api/agents/speak` - Text-to-speech
- `GET /api/agents/speech-token` - Get speech token

### Calling
- `POST /api/agents/call` - Initiate emergency call
- `GET /api/agents/sessions` - View active calls
- `GET /api/agents/twiml/answer` - Twilio webhook
- `POST /api/agents/twiml/respond` - Twilio webhook
- `POST /api/agents/twiml/status` - Twilio webhook

### Messaging
- `POST /api/agents/message` - Send single SMS
- `POST /api/agents/message/bulk` - Send bulk SMS
- `GET /api/agents/message/status/:sid` - Check status

## Usage Examples

### Emergency Guidance Chat
```javascript
// User asks for help during emergency
const response = await fetch('http://localhost:3000/api/agents/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Someone is having a heart attack, what should I do?',
    history: []
  })
});

const data = await response.json();
console.log(data.reply); 
// "Stay calm. Call 108 immediately. Have the person sit down and rest. 
//  If they have aspirin, give them one to chew. Loosen tight clothing. 
//  Stay with them until help arrives. Do not leave them alone."
```

### Make Emergency Call
```javascript
const response = await fetch('http://localhost:3000/api/agents/call', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: '+917330873455',
    situation: 'Person fell and is injured',
    context: 'Emergency contact - friend'
  })
});

const data = await response.json();
console.log(data.callSid); // Twilio call ID
```

### Send Emergency SMS
```javascript
const response = await fetch('http://localhost:3000/api/agents/message', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: '+917330873455',
    situation: 'Person fell and is injured',
    recipientName: 'John'
  })
});

const data = await response.json();
console.log(data.messageSid); // Twilio message ID
```

## Troubleshooting

### "Service not available" error
- Ensure all dependencies are installed: `npm install`
- Check environment variables in `.env`
- Restart the server

### Chat not responding
- Verify `GITHUB_TOKEN` is valid
- Check server logs for errors
- Test with curl command first

### Calls not working
- Ensure ngrok is running
- Verify `PUBLIC_URL` matches ngrok URL
- Check Twilio phone number format (+1234567890)
- View Twilio console logs

### SMS not sending
- Verify Twilio credentials
- Check phone number has SMS capability
- Ensure recipient number is verified (trial accounts)

### Azure Speech errors
- Verify `AZURE_SPEECH_KEY` is correct
- Check region matches your Azure resource
- Ensure you haven't exceeded free tier limits

## Cost Considerations

### Free Tiers
- **GitHub Models**: Free for personal use
- **Twilio Trial**: $15 credit (enough for testing)
- **Azure Speech**: 5M characters/month free

### Paid Usage
- **Twilio**: ~$0.01/SMS, ~$0.02/min for calls
- **Azure Speech**: $1 per 1M characters after free tier

## Security Notes

1. **Never commit `.env` file** - It contains sensitive keys
2. **Use environment variables** - Don't hardcode API keys
3. **Validate phone numbers** - Prevent abuse
4. **Rate limiting** - Add rate limits in production
5. **HTTPS only** - Use secure connections

## Next Steps

1. **Test all features** - Try chat, calls, and SMS
2. **Customize responses** - Edit prompts in agent files
3. **Add user contacts** - Integrate with user's emergency contacts
4. **Deploy to production** - Use proper hosting (not ngrok)
5. **Monitor usage** - Track API costs and limits

## Support

For detailed documentation:
- Backend agents: `backend/agents/README.md`
- API reference: See endpoint descriptions above
- Twilio docs: https://www.twilio.com/docs
- Azure Speech: https://docs.microsoft.com/azure/cognitive-services/speech-service

## File Structure

```
lifelinksos/
├── backend/
│   ├── agents/
│   │   ├── agent.js                    # Core AI integration
│   │   ├── ChatController.js           # Chat & speech
│   │   ├── CallingController.js        # Voice calls
│   │   ├── MessagingController.js      # SMS
│   │   ├── package.json                # ES module config
│   │   └── README.md                   # Detailed docs
│   ├── routes/
│   │   └── agents.js                   # API routes
│   ├── .env.example                    # Environment template
│   ├── setup-agents.bat                # Windows setup
│   └── setup-agents.sh                 # Linux/Mac setup
├── mobile/
│   └── src/
│       └── components/
│           └── ChatbotButton.js        # AI chatbot UI
└── AGENTS_INTEGRATION_GUIDE.md         # This file
```

## Success! 🎉

Your LifeLink app now has comprehensive AI-powered emergency response capabilities:

### 1. AI Emergency Calling (EmergencyCallScreen)
When SOS is triggered, AI agents simultaneously call all your emergency contacts to get help fast. This is integrated into the emergency screen and activates automatically during SOS alerts.

**Purpose**: Get help from your contacts as quickly as possible

### 2. Emergency Guidance Chatbot (ChatbotButton)
A floating chatbot button on the home screen provides real-time first-aid instructions and emergency guidance. Users can ask questions and get immediate step-by-step instructions.

**Purpose**: Guide the user on what to do during an emergency

### How They Work Together

**Scenario**: User witnesses a car accident

1. **User taps chatbot**: "There's been a car accident, what should I do?"
2. **Chatbot responds**: "Stay calm. Call 108 immediately. Check if safe to approach. Don't move injured people unless there's fire..."
3. **User follows guidance** while assessing the situation
4. **If user needs help**: Taps SOS button
5. **AI calling activates**: Simultaneously calls all emergency contacts
6. **SMS alerts sent**: All contacts receive emergency SMS
7. **User continues with chatbot**: Gets more specific guidance based on injuries

Both systems work independently but complement each other perfectly!

## Quick Start

1. **Install dependencies**: `cd backend && npm install`
2. **Configure API keys**: Add to `backend/.env`
3. **Start backend**: `npm run dev`
4. **Test chatbot**: Tap blue button on home screen
5. **Test AI calling**: Trigger SOS alert

For detailed setup, see the sections above.

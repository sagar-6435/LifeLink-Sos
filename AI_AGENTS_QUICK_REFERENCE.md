# AI Agents Quick Reference

## Two AI Systems, Two Purposes

### 🤖 AI Emergency Calling
**Location**: Emergency Call Screen (auto-activates on SOS)  
**Purpose**: Call your emergency contacts to GET HELP  
**How**: AI agents call all contacts simultaneously  

### 💬 Emergency Guidance Chatbot
**Location**: Home Screen (blue floating button)  
**Purpose**: Guide YOU on what to do right now  
**How**: Real-time first-aid instructions via chat  

---

## AI Emergency Calling

### When It Activates
- User presses SOS button on home screen
- Automatically starts emergency sequence

### What It Does
1. Calls emergency services (108, 100)
2. AI agents call ALL emergency contacts at once
3. Each AI speaks with a contact, explains situation
4. Sends SMS to all contacts with location
5. Shows real-time status on screen

### Example AI Call
```
AI: "Hello, this is LifeLink Emergency Service. 
     I'm calling about John Doe. He has triggered 
     an emergency alert at location [coordinates]. 
     He needs immediate assistance. Can you help?"

Contact: "What happened? Is he okay?"

AI: "The emergency alert was triggered manually. 
     Immediate assistance is required. Can you 
     reach him or should I contact additional services?"

Contact: "I'm on my way!"

AI: "Thank you. Please hurry. Stay safe."
```

### Key Features
- ✅ Simultaneous calls (saves time)
- ✅ Natural conversation
- ✅ Multi-language support
- ✅ Location sharing
- ✅ SMS backup

### Configuration
```env
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=xxxxx
TWILIO_PHONE_NUMBER=+1234567890
PUBLIC_URL=https://your-ngrok-url.ngrok.io
GITHUB_TOKEN=ghp_xxxxx
```

### API Endpoint
```
POST /api/agents/call
{
  "to": "+917330873455",
  "situation": "Emergency alert from user",
  "context": "Emergency contact - friend"
}
```

---

## Emergency Guidance Chatbot

### When To Use
- Before triggering SOS (assess situation)
- During emergency (get instructions)
- After SOS (continue guidance)
- Anytime you need emergency advice

### What It Provides
- First-aid instructions (CPR, bleeding, choking, etc.)
- Emergency assessment help
- Step-by-step guidance
- Multi-language support
- Calm, clear instructions

### Example Conversations

**Heart Attack**
```
User: "My father has chest pain and is sweating"

Bot: "This could be a heart attack. Call 108 immediately.
     While waiting:
     1. Have him sit down and rest
     2. Loosen tight clothing
     3. Give aspirin if available (chew, don't swallow)
     4. Keep him calm
     5. Do NOT leave him alone
     
     Is he conscious and breathing?"
```

**Severe Bleeding**
```
User: "Someone cut their arm, lots of blood"

Bot: "Act quickly:
     1. Apply direct pressure with clean cloth
     2. Press firmly, don't lift to check
     3. Elevate arm above heart
     4. If blood soaks through, add more cloth
     5. Call 108 now
     
     Is bleeding slowing?"
```

**Choking**
```
User: "Friend is choking, can't breathe"

Bot: "Act immediately! Heimlich maneuver:
     1. Stand behind them
     2. Fist above belly button
     3. Grab fist with other hand
     4. Quick upward thrusts
     5. Repeat until object comes out
     
     Can they cough or speak?"
```

### Key Features
- ✅ Instant guidance
- ✅ Context-aware (remembers conversation)
- ✅ Multi-language (English, Telugu, Tamil, Hindi, Kannada)
- ✅ Emergency detection
- ✅ Quick action buttons

### Configuration
```env
GITHUB_TOKEN=ghp_xxxxx
```

### API Endpoint
```
POST /api/agents/chat
{
  "message": "Someone is choking, what do I do?",
  "history": []
}
```

---

## How They Work Together

### Scenario 1: Witness an Accident

1. **Open chatbot**: "There's been a car accident"
2. **Get guidance**: "Call 108. Check if safe. Don't move injured..."
3. **Follow instructions**: Assess situation
4. **Need help?**: Press SOS button
5. **AI calls contacts**: All contacts called simultaneously
6. **Continue chatbot**: Get specific injury guidance

### Scenario 2: Medical Emergency at Home

1. **Open chatbot**: "My mother is having chest pain"
2. **Get assessment**: "Could be heart attack. Call 108..."
3. **Follow first-aid**: Give aspirin, keep calm
4. **Press SOS**: Alert all emergency contacts
5. **AI calls everyone**: Family/friends notified
6. **Chatbot guides**: Continue monitoring until help arrives

### Scenario 3: Personal Emergency

1. **Press SOS**: Immediate danger
2. **AI calls contacts**: Everyone notified at once
3. **Open chatbot**: "I fell and hurt my leg, what do I do?"
4. **Get guidance**: "Don't move. Check for fracture..."
5. **Wait for help**: Follow chatbot instructions

---

## Quick Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your API keys
```

### 3. Get API Keys

**GitHub Token** (Required for both)
- https://github.com/settings/tokens
- Generate token with `repo` scope
- Add to `GITHUB_TOKEN`

**Twilio** (Required for AI calling only)
- https://www.twilio.com/try-twilio
- Get Account SID, Auth Token, Phone Number
- Add to `.env`

**Ngrok** (Required for AI calling only)
- https://ngrok.com/download
- Run: `ngrok http 3000`
- Add HTTPS URL to `PUBLIC_URL`

### 4. Start Backend
```bash
npm run dev
```

### 5. Test

**Test Chatbot**
```bash
curl -X POST http://localhost:3000/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Someone is choking", "history": []}'
```

**Test AI Calling**
```bash
curl -X POST http://localhost:3000/api/agents/call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+917330873455",
    "situation": "Emergency alert",
    "context": "Emergency contact"
  }'
```

---

## API Endpoints Summary

### Chat Endpoints
- `POST /api/agents/chat` - Send message, get guidance
- `POST /api/agents/speak` - Text-to-speech
- `GET /api/agents/speech-token` - Get speech token

### Calling Endpoints
- `POST /api/agents/call` - Initiate AI call
- `GET /api/agents/sessions` - View active calls
- `GET /api/agents/twiml/answer` - Twilio webhook
- `POST /api/agents/twiml/respond` - Twilio webhook
- `POST /api/agents/twiml/status` - Twilio webhook

### Messaging Endpoints
- `POST /api/agents/message` - Send single SMS
- `POST /api/agents/message/bulk` - Send bulk SMS
- `GET /api/agents/message/status/:sid` - Check status

---

## Cost Estimate

### Per Emergency (3 contacts)
- AI Calls: 3 × $0.02/min × 2 min = $0.12
- SMS: 3 × $0.01 = $0.03
- Chat: Free (GitHub Models)
- **Total: ~$0.15 per emergency**

### Twilio Trial
- $15 free credit = ~100 emergencies
- Perfect for testing

---

## Troubleshooting

### Chatbot Not Responding
- ✓ Check `GITHUB_TOKEN` is valid
- ✓ Backend server is running
- ✓ Check server logs for errors

### AI Calls Not Working
- ✓ Verify Twilio credentials
- ✓ Ensure ngrok is running
- ✓ Check `PUBLIC_URL` matches ngrok
- ✓ Phone numbers in E.164 format (+1234567890)

### SMS Not Sending
- ✓ Verify Twilio credentials
- ✓ Check phone number has SMS capability
- ✓ Trial accounts: verify recipient numbers

---

## File Locations

```
backend/
├── agents/
│   ├── agent.js              # Core AI
│   ├── ChatController.js     # Chatbot
│   ├── CallingController.js  # AI calling
│   └── MessagingController.js # SMS
├── routes/
│   └── agents.js             # API routes
└── .env                      # Configuration

mobile/
└── src/
    ├── components/
    │   └── ChatbotButton.js  # Chatbot UI
    └── screens/
        └── EmergencyCallScreen.js # AI calling UI
```

---

## Documentation

- **Full Setup**: `AGENTS_INTEGRATION_GUIDE.md`
- **AI Calling Details**: `EMERGENCY_AI_CALLING.md`
- **Chatbot Details**: `EMERGENCY_GUIDANCE_CHATBOT.md`
- **Agent API Docs**: `backend/agents/README.md`

---

## Key Differences

| Feature | AI Calling | Chatbot |
|---------|-----------|---------|
| **Purpose** | Get help from others | Guide yourself |
| **Trigger** | SOS button | Manual (blue button) |
| **Location** | Emergency screen | Home screen |
| **Action** | Calls contacts | Provides instructions |
| **When** | Critical emergency | Before/during/after |
| **Cost** | ~$0.15/emergency | Free |
| **Requires** | Twilio + ngrok | GitHub token only |

---

## Remember

- **Chatbot = Guidance for YOU**
- **AI Calling = Get HELP from others**
- **Both work together for complete emergency response**

Start with the chatbot for guidance, press SOS when you need help from others!

# LifeLink AI Agents

This folder contains AI-powered agents for emergency response, including chat, calling, and messaging capabilities.

## Features

### 1. Chat Agent (`ChatController.js`)
- Multi-language support (English, Telugu, Tamil, Kannada, Hindi)
- Emergency keyword detection
- Automatic emergency service triggering
- Text-to-speech capabilities
- Real-time emergency guidance

### 2. Calling Agent (`CallingController.js`)
- AI-powered voice calls to emergency contacts
- Natural conversation flow
- Multi-language support
- Twilio integration for phone calls
- Call status tracking

### 3. Messaging Agent (`MessagingController.js`)
- AI-generated emergency SMS messages
- Bulk messaging to multiple contacts
- Message status tracking
- Twilio SMS integration

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Environment Variables

Add the following to your `backend/.env` file:

```env
# AI Agent Configuration
GITHUB_TOKEN=your_github_token_here

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
PUBLIC_URL=https://your-ngrok-url.ngrok.io

# Azure Speech Services
AZURE_SPEECH_KEY=your_azure_speech_key
AZURE_SPEECH_REGION=eastus
AZURE_ENDPOINT=https://eastus.api.cognitive.microsoft.com/
```

### 3. Get API Keys

#### GitHub Token (for AI Models)
1. Go to https://github.com/settings/tokens
2. Generate a new token with appropriate permissions
3. Copy the token to `GITHUB_TOKEN`

#### Twilio (for Calls & SMS)
1. Sign up at https://www.twilio.com
2. Get your Account SID and Auth Token from the console
3. Purchase a phone number
4. Add credentials to `.env`

#### Azure Speech Services (for TTS)
1. Create an Azure account at https://azure.microsoft.com
2. Create a Speech Service resource
3. Copy the key and region to `.env`

#### Ngrok (for Twilio Webhooks)
1. Install ngrok: https://ngrok.com/download
2. Run: `ngrok http 3000`
3. Copy the HTTPS URL to `PUBLIC_URL` in `.env`

## API Endpoints

### Chat Endpoints

#### POST `/api/agents/chat`
Send a message to the AI assistant.

```json
{
  "message": "I need help, I fell down",
  "history": []
}
```

Response:
```json
{
  "reply": "I understand you've fallen. Are you injured? Can you move?",
  "detectedInputLang": { "code": "en-IN", "name": "English" },
  "replyLang": { "code": "en-IN", "name": "English" },
  "emergencyTriggered": true,
  "emergencyActions": {
    "message": { "messageSid": "SM...", "status": "sent" },
    "call": { "callSid": "CA...", "status": "queued" }
  }
}
```

#### POST `/api/agents/speak`
Convert text to speech.

```json
{
  "text": "Hello, this is an emergency",
  "lang": "en-IN"
}
```

Returns: Audio file (MP3)

#### GET `/api/agents/speech-token`
Get Azure Speech token for client-side speech recognition.

### Calling Endpoints

#### POST `/api/agents/call`
Initiate an AI-powered emergency call.

```json
{
  "to": "+917330873455",
  "situation": "Person fell down and is injured",
  "context": "Emergency contact - friend"
}
```

#### GET `/api/agents/sessions`
Get active call sessions (for debugging).

### Messaging Endpoints

#### POST `/api/agents/message`
Send an AI-generated emergency SMS.

```json
{
  "to": "+917330873455",
  "situation": "Person fell down and is injured",
  "context": "Emergency contact",
  "recipientName": "John"
}
```

#### POST `/api/agents/message/bulk`
Send messages to multiple contacts.

```json
{
  "recipients": [
    { "to": "+917330873455", "recipientName": "John" },
    { "to": "+919876543210", "recipientName": "Jane" }
  ],
  "situation": "Person fell down and is injured",
  "context": "Emergency contacts"
}
```

#### GET `/api/agents/message/status/:sid`
Check message delivery status.

## Emergency Keywords

The chat agent automatically detects emergency situations based on keywords:

**English**: injured, hurt, bleeding, accident, crash, fell, help, emergency, attack, unconscious, choking, drowning, stroke, seizure, fire, pain, etc.

**Telugu**: సహాయం, నొప్పి, ప్రమాదం, గాయపడ్డాను

**Hindi**: help karo, bachao, madad, dard, chot lagi

**Tamil**: உதவி, காயம், ஆபத்து

When detected, the system automatically:
1. Sends SMS to emergency contacts
2. Initiates voice calls
3. Provides immediate guidance

## Testing

### Test Chat Agent
```bash
curl -X POST http://localhost:3000/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I need help, I fell down", "history": []}'
```

### Test Calling Agent
```bash
curl -X POST http://localhost:3000/api/agents/call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+917330873455",
    "situation": "Person fell and is injured",
    "context": "Emergency contact"
  }'
```

### Test Messaging Agent
```bash
curl -X POST http://localhost:3000/api/agents/message \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+917330873455",
    "situation": "Person fell and is injured",
    "recipientName": "John"
  }'
```

## Mobile Integration

The chatbot button in the mobile app (`mobile/src/components/ChatbotButton.js`) is already integrated with these agents. It will:

1. Send user messages to `/api/agents/chat`
2. Display AI responses in real-time
3. Show emergency alerts when triggered
4. Support multi-language conversations

## Architecture

```
User Message → Chat Agent → Emergency Detection
                    ↓
            [If Emergency]
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
  Messaging Agent         Calling Agent
        ↓                       ↓
    Send SMS              Make Voice Call
```

## Notes

- The agents use ES modules (type: "module" in package.json)
- Emergency contact number is hardcoded in `ChatController.js` (line 11)
- For production, integrate with user's emergency contacts from database
- Twilio webhooks require a public URL (use ngrok for development)
- Azure Speech Services has usage limits on free tier

## Troubleshooting

### "Service not available" error
- Make sure all dependencies are installed: `npm install`
- Check that environment variables are set correctly
- Restart the server after adding new env variables

### Twilio webhook errors
- Ensure ngrok is running and PUBLIC_URL is updated
- Check Twilio console for webhook logs
- Verify phone numbers are in E.164 format (+1234567890)

### Azure Speech errors
- Verify AZURE_SPEECH_KEY and AZURE_SPEECH_REGION are correct
- Check Azure portal for service status
- Ensure you haven't exceeded free tier limits

## License

Part of the LifeLink emergency response system.

# Emergency AI Calling System

## Overview

The LifeLink Emergency AI Calling System uses AI agents to simultaneously call all emergency contacts when an SOS alert is triggered. This dramatically reduces response time by eliminating the need to call contacts one by one.

## How It Works

### Traditional Approach (Slow)
```
User triggers SOS
  → Call Contact 1 (wait for answer/voicemail)
  → Call Contact 2 (wait for answer/voicemail)
  → Call Contact 3 (wait for answer/voicemail)
  → Total time: 3-5 minutes
```

### AI Agent Approach (Fast)
```
User triggers SOS
  → AI Agent 1 calls Contact 1 ┐
  → AI Agent 2 calls Contact 2 ├─ All simultaneous
  → AI Agent 3 calls Contact 3 ┘
  → Total time: 10-15 seconds
```

## Emergency Flow

When a user presses the SOS button:

1. **Emergency Services Called** (2-4 seconds)
   - Calls 108 (Ambulance)
   - Calls 100 (Police)
   - Any other configured emergency numbers

2. **AI Agents Call All Contacts** (Simultaneous)
   - Each contact gets their own AI agent
   - AI introduces itself: "This is LifeLink Emergency Service"
   - AI explains the situation with location details
   - AI answers questions from the contact
   - AI speaks in the contact's language if detected

3. **SMS Alerts Sent** (Simultaneous)
   - All contacts receive emergency SMS
   - Includes situation and location
   - Provides immediate context

## AI Agent Conversation Example

**AI Agent**: "Hello, this is LifeLink Emergency Service. I'm calling about [User Name]. They have triggered an emergency alert. Their current location is [coordinates]. They need immediate assistance. Can you help?"

**Contact**: "What happened? Is he okay?"

**AI Agent**: "The emergency alert was triggered manually. Based on the situation, immediate assistance is required. The person is at [location]. Can you reach them or should I contact additional emergency services?"

**Contact**: "I'm on my way. I'll be there in 10 minutes."

**AI Agent**: "Thank you so much. Please hurry. Your help means everything right now. Stay safe."

## Technical Implementation

### Mobile App (EmergencyCallScreen.js)

```javascript
// When SOS is triggered
const makeAICallsToContacts = async (user, location) => {
  const contacts = await loadEmergencyContacts();
  
  const situation = `Emergency alert from ${user.name}. 
                     Location: ${location.latitude}, ${location.longitude}. 
                     Immediate assistance required.`;
  
  // Call all contacts simultaneously
  const callPromises = contacts.map(contact => 
    fetch(`${API_URL}/api/agents/call`, {
      method: 'POST',
      body: JSON.stringify({
        to: contact.phone,
        situation,
        context: `Emergency contact: ${contact.name}`
      })
    })
  );
  
  // Wait for all calls to initiate
  await Promise.all(callPromises);
};
```

### Backend (CallingController.js)

The AI agent:
1. Receives call request with situation and contact info
2. Generates opening message using AI
3. Initiates Twilio call
4. Handles conversation flow with natural language
5. Detects when contact confirms they're helping
6. Ends call gracefully

## Real-Time Status Tracking

The emergency screen shows:
- ✓ Emergency Services - Completed
- 🤖 AI Calling Contacts - In Progress
  - John Doe (+917330873455) - AI Speaking
  - Jane Smith (+919876543210) - AI Speaking
  - Bob Wilson (+918765432109) - Connected
- ✓ SMS Alerts - Completed

## Multi-Language Support

The AI agent automatically detects and responds in:
- English (en-IN)
- Telugu (te-IN)
- Tamil (ta-IN)
- Hindi (hi-IN)
- Kannada (kn-IN)

If a contact responds in Telugu, the AI will continue the conversation in Telugu.

## Configuration

### Required Environment Variables

```env
# Twilio (for making calls)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Public URL for webhooks
PUBLIC_URL=https://your-ngrok-url.ngrok.io

# AI Model
GITHUB_TOKEN=ghp_your_token
```

### Emergency Contact Format

Contacts are stored in AsyncStorage:
```json
[
  {
    "name": "John Doe",
    "phone": "+917330873455",
    "relationship": "Brother"
  },
  {
    "name": "Jane Smith",
    "phone": "+919876543210",
    "relationship": "Friend"
  }
]
```

## Cost Considerations

### Per Emergency Alert (3 contacts)
- **AI Calls**: 3 calls × $0.02/min × 2 min avg = $0.12
- **SMS**: 3 messages × $0.01 = $0.03
- **Total**: ~$0.15 per emergency

### Twilio Trial Account
- $15 free credit = ~100 emergency alerts
- Perfect for testing and development

## Testing

### Test Single AI Call

```bash
curl -X POST http://localhost:3000/api/agents/call \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+917330873455",
    "situation": "Test emergency - person fell and is injured",
    "context": "Emergency contact - friend"
  }'
```

### Test from Mobile App

1. Add emergency contacts in the app
2. Trigger SOS from home screen
3. Watch the emergency screen for real-time status
4. Your contacts will receive AI calls

**Important**: Use test phone numbers during development!

## Troubleshooting

### Calls Not Connecting

**Problem**: AI calls show "failed" status

**Solutions**:
1. Verify Twilio credentials in `.env`
2. Check phone numbers are in E.164 format (+1234567890)
3. Ensure ngrok is running and PUBLIC_URL is updated
4. Check Twilio console for error logs
5. Verify trial account has verified the phone numbers

### AI Not Speaking

**Problem**: Call connects but AI doesn't speak

**Solutions**:
1. Check GITHUB_TOKEN is valid
2. Verify PUBLIC_URL matches ngrok URL exactly
3. Check server logs for AI generation errors
4. Ensure Twilio webhook URLs are accessible

### Calls Dropping Immediately

**Problem**: Calls connect then drop

**Solutions**:
1. Verify PUBLIC_URL is HTTPS (not HTTP)
2. Check ngrok is still running
3. Ensure webhook endpoints are responding
4. Check Twilio debugger for webhook errors

## Advantages Over Traditional Calling

| Feature | Traditional | AI Agents |
|---------|------------|-----------|
| Time to reach all contacts | 3-5 minutes | 10-15 seconds |
| Simultaneous calls | No | Yes |
| Consistent message | No | Yes |
| Language adaptation | No | Yes |
| Answers questions | No | Yes |
| Works if user unconscious | No | Yes |
| Scalable to many contacts | No | Yes |

## Security & Privacy

1. **Call Recording**: Twilio can record calls for legal purposes
2. **Data Privacy**: Location shared only during emergencies
3. **Consent**: Users must add contacts who consent to emergency calls
4. **Verification**: Contacts should verify caller ID shows Twilio number

## Future Enhancements

1. **Video Calls**: Add video calling capability
2. **Live Location Sharing**: Send real-time location updates
3. **Medical History**: Share relevant medical info with responders
4. **Group Conference**: Connect all contacts in one call
5. **AI Triage**: AI assesses severity and prioritizes contacts

## Success Metrics

Track these metrics to measure effectiveness:
- Average time to first contact reached
- Percentage of contacts who answer
- Average call duration
- Contact response rate
- Time saved vs traditional calling

## Compliance

### India Telecom Regulations
- Emergency calls are permitted under TRAI guidelines
- Automated calls must identify as automated
- Users must consent to emergency contact system
- Call recordings must be stored securely

### GDPR/Privacy
- Users control their emergency contacts
- Contacts can opt-out anytime
- Location shared only during emergencies
- Call logs stored securely

## Support

For issues or questions:
1. Check backend logs: `npm run dev` in backend folder
2. Check Twilio console: https://console.twilio.com
3. Review ngrok logs: ngrok dashboard
4. Test with curl commands first

## Summary

The AI Emergency Calling System is the core feature that makes LifeLink unique. By using AI agents to call all emergency contacts simultaneously, we reduce critical response time from minutes to seconds, potentially saving lives in emergency situations.

The system is:
- ✅ Fast (simultaneous calls)
- ✅ Reliable (AI handles conversation)
- ✅ Scalable (works with any number of contacts)
- ✅ Intelligent (multi-language, natural conversation)
- ✅ Cost-effective (~$0.15 per emergency)

Start testing with the Twilio trial account and see the difference AI agents make in emergency response!

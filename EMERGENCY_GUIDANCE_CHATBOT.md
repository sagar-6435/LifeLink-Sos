# Emergency Guidance Chatbot

## Overview

The LifeLink Emergency Guidance Chatbot is an AI-powered assistant that provides real-time first-aid instructions and emergency guidance. It helps users stay calm and take the right actions during critical situations.

## Purpose

In emergency situations, people often panic and don't know what to do. The chatbot:
- Provides immediate, step-by-step guidance
- Helps assess the severity of the situation
- Gives clear first-aid instructions
- Supports multiple languages
- Maintains a calm, authoritative tone to reduce panic

## Key Features

### 1. First-Aid Guidance

The chatbot can guide users through:
- **CPR**: Step-by-step cardiopulmonary resuscitation
- **Choking**: Heimlich maneuver instructions
- **Bleeding**: How to stop severe bleeding
- **Burns**: Immediate burn treatment
- **Fractures**: How to immobilize injuries
- **Heart Attack**: What to do while waiting for ambulance
- **Stroke**: Recognizing signs and immediate actions
- **Seizures**: How to help someone having a seizure
- **Snake Bites**: Critical first steps
- **Drowning**: Rescue and resuscitation

### 2. Emergency Assessment

Helps users determine:
- Is this a life-threatening emergency?
- Should I call 108 immediately?
- Can I handle this or do I need professional help?
- What's the most critical action right now?

### 3. Multi-Language Support

Automatically detects and responds in:
- **English** (en-IN)
- **Telugu** (te-IN) - సహాయం
- **Tamil** (ta-IN) - உதவி
- **Hindi** (hi-IN) - मदद
- **Kannada** (kn-IN) - ಸಹಾಯ

### 4. Context-Aware Conversations

The chatbot:
- Remembers previous messages in the conversation
- Provides follow-up instructions
- Adapts to the user's situation
- Asks clarifying questions when needed

## Example Conversations

### Example 1: Heart Attack

**User**: "My father is having chest pain and sweating a lot"

**Chatbot**: "This could be a heart attack. Call 108 immediately. While waiting:
1. Have him sit down and rest
2. Loosen any tight clothing
3. If he has aspirin, give him one to chew (not swallow)
4. Keep him calm and still
5. Do NOT leave him alone

Is he conscious and breathing?"

**User**: "Yes, he's conscious"

**Chatbot**: "Good. Keep him sitting upright or in a comfortable position. Monitor his breathing. If he becomes unconscious or stops breathing, be ready to start CPR. Help is on the way."

### Example 2: Severe Bleeding

**User**: "Someone cut their arm badly, there's a lot of blood"

**Chatbot**: "Act quickly to stop the bleeding:
1. Apply direct pressure with a clean cloth
2. Press firmly and don't lift to check
3. Elevate the arm above heart level
4. If blood soaks through, add more cloth on top
5. Call 108 now

Is the bleeding slowing down?"

**User**: "Yes, it's slowing"

**Chatbot**: "Excellent. Keep the pressure on. Don't remove the cloth. If you have a clean bandage, wrap it tightly once bleeding stops. Watch for signs of shock: pale skin, rapid breathing, confusion. Keep the person warm and lying down."

### Example 3: Choking

**User**: "My friend is choking on food, can't breathe"

**Chatbot**: "Act immediately! Perform the Heimlich maneuver:
1. Stand behind them
2. Make a fist above their belly button
3. Grab your fist with other hand
4. Give quick, upward thrusts
5. Repeat until object comes out

Can they cough or speak at all?"

**User**: "They're coughing now"

**Chatbot**: "Good sign! Encourage them to keep coughing. Don't hit their back while they can cough. If coughing stops and they can't breathe, continue Heimlich. Call 108 if object doesn't come out in 1-2 minutes."

### Example 4: Car Accident

**User**: "There's been a car accident, what should I do?"

**Chatbot**: "Stay calm. Follow these steps:
1. Call 108 immediately
2. Check if it's safe to approach
3. Turn off car engines if possible
4. Don't move injured people unless there's fire
5. Check for breathing and severe bleeding
6. Keep injured people warm and calm

How many people are injured?"

**User**: "Two people, one is bleeding from the head"

**Chatbot**: "For head bleeding:
- Apply gentle pressure with clean cloth
- Don't press too hard on skull
- Keep person still, don't move their neck
- Watch for consciousness changes

For the other person, check their breathing and look for other injuries. Help is coming."

### Example 5: Telugu Language

**User**: "నా అమ్మ పడిపోయింది, కాలు విరిగింది" (My mother fell, leg is broken)

**Chatbot**: "వెంటనే 108 కు కాల్ చేయండి. అప్పటి వరకు:
1. ఆమెను కదపకండి
2. విరిగిన కాలును కదలకుండా ఉంచండి
3. దిండు లేదా దుప్పటితో సపోర్ట్ చేయండి
4. నొప్పి ఎక్కువగా ఉంటే చల్లని నీటి సంచి పెట్టండి
5. ఆమెను వెచ్చగా ఉంచండి

ఆమె స్పృహలో ఉన్నారా?" (Call 108 immediately. Until then: 1. Don't move her 2. Keep broken leg still 3. Support with pillow or blanket 4. Apply cold pack if pain is severe 5. Keep her warm. Is she conscious?)

## System Prompt

The chatbot uses this system prompt to maintain consistency:

```
You are LifeLink — a calm, authoritative AI emergency response agent for South India.
You assist with:
1. ROAD ACCIDENTS — first aid guidance, ambulance coordination, bystander help
2. HEALTH CRISES — heart attack, stroke, seizure, choking, drowning, snake bite
3. WOMEN'S SAFETY — harassment, assault, stalking, unsafe situations

CRITICAL RULES:
- Always respond in the SAME LANGUAGE the user speaks
- Be CALM, CLEAR, AUTHORITATIVE — you are their lifeline
- Give step-by-step instructions, most critical action FIRST
- Always include relevant emergency numbers:
  * Ambulance: 108
  * Police: 100
  * Women's Helpline: 1091
  * Fire: 101
  * National Emergency: 112
- Keep responses SHORT (2-4 sentences) for quick reading
- If immediate danger, begin with the single most critical action
- You have a warm, trustworthy South Indian personality
```

## Integration in Mobile App

### Location: Home Screen

The chatbot button appears on the home screen as a floating blue button with a robot icon.

### Usage Flow

1. User taps the chatbot button
2. Chat interface opens with welcome message
3. User types their emergency question
4. AI provides immediate guidance
5. Conversation continues with follow-up questions
6. User can use quick action buttons for common questions

### Quick Action Buttons

- "How to use SOS"
- "Add emergency contacts"
- "Location help"
- "First aid for bleeding"
- "CPR instructions"
- "Heart attack help"

## Technical Implementation

### API Endpoint

```
POST /api/agents/chat
```

### Request Format

```json
{
  "message": "Someone is choking, what do I do?",
  "history": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant",
      "content": "Previous response"
    }
  ]
}
```

### Response Format

```json
{
  "reply": "Act immediately! Perform the Heimlich maneuver...",
  "detectedInputLang": {
    "code": "en-IN",
    "name": "English"
  },
  "replyLang": {
    "code": "en-IN",
    "name": "English"
  },
  "emergencyTriggered": false
}
```

### Emergency Detection

If the chatbot detects critical emergency keywords, it can automatically:
- Trigger emergency services
- Send SMS to contacts
- Initiate AI calls

**Emergency Keywords**: injured, hurt, bleeding, accident, crash, fell, help, emergency, attack, unconscious, choking, drowning, stroke, seizure, fire, pain, dying, etc.

## Mobile Component Code

```javascript
// ChatbotButton.js
const handleSend = async () => {
  const response = await fetch(`${API_URL}/api/agents/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: inputText,
      history: conversationHistory,
    }),
  });

  const data = await response.json();
  
  // Display AI response
  setMessages([...messages, {
    text: data.reply,
    sender: 'bot',
    timestamp: new Date()
  }]);
  
  // Show alert if emergency was triggered
  if (data.emergencyTriggered) {
    Alert.alert('Emergency Alert', 'Emergency services have been notified.');
  }
};
```

## Best Practices

### For Users

1. **Be Specific**: Describe the situation clearly
   - ❌ "Someone is hurt"
   - ✅ "Person fell from ladder, bleeding from head, unconscious"

2. **Follow Instructions**: Read and follow each step carefully

3. **Ask Follow-up Questions**: If unclear, ask for clarification

4. **Call 108 First**: For life-threatening emergencies, call 108 immediately, then use chatbot for guidance while waiting

### For Developers

1. **Keep Responses Short**: Emergency situations require quick, scannable text

2. **Prioritize Actions**: Most critical action should be first

3. **Include Emergency Numbers**: Always remind users to call professional help

4. **Test Multi-Language**: Ensure responses work in all supported languages

5. **Handle Offline**: Provide fallback responses if API is unavailable

## Limitations

The chatbot:
- ❌ Cannot replace professional medical advice
- ❌ Cannot diagnose medical conditions
- ❌ Cannot see the actual situation
- ❌ Cannot guarantee outcomes
- ✅ Can provide general first-aid guidance
- ✅ Can help users stay calm and focused
- ✅ Can guide users until professional help arrives

## Disclaimer

Always displayed in the app:
```
"This chatbot provides general emergency guidance only. 
Always call 108 for medical emergencies. 
Follow professional medical advice when available."
```

## Testing

### Test Emergency Guidance

```bash
curl -X POST http://localhost:3000/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Someone is having a heart attack, what should I do?",
    "history": []
  }'
```

### Test Multi-Language

```bash
# Telugu
curl -X POST http://localhost:3000/api/agents/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "నాకు సహాయం కావాలి",
    "history": []
  }'
```

### Test from Mobile App

1. Open the app
2. Tap the blue chatbot button (bottom-right)
3. Type: "Someone is choking, what do I do?"
4. Verify you get step-by-step Heimlich instructions
5. Ask follow-up: "They're still choking"
6. Verify contextual response

## Common Emergency Scenarios

The chatbot is trained to handle:

### Medical Emergencies
- Heart attack
- Stroke
- Seizure
- Diabetic emergency
- Allergic reaction
- Asthma attack
- Poisoning

### Trauma
- Severe bleeding
- Fractures
- Head injury
- Spinal injury
- Burns
- Eye injury

### Breathing Emergencies
- Choking
- Drowning
- Suffocation
- Hyperventilation

### Environmental
- Heat stroke
- Hypothermia
- Snake bite
- Animal attack
- Electric shock

### Safety
- Fire
- Gas leak
- Chemical exposure
- Assault
- Harassment

## Success Metrics

Track these to measure effectiveness:
- Average response time
- User satisfaction ratings
- Follow-up question rate
- Emergency detection accuracy
- Language detection accuracy
- Conversation completion rate

## Future Enhancements

1. **Voice Input**: Speak instead of type
2. **Image Analysis**: Upload photos for assessment
3. **Video Guidance**: Show video demonstrations
4. **Offline Mode**: Pre-loaded responses for common emergencies
5. **Medical History**: Personalized guidance based on user's conditions
6. **Live Expert**: Connect to human medical professional if needed

## Summary

The Emergency Guidance Chatbot is a critical support feature that:
- ✅ Provides immediate first-aid guidance
- ✅ Helps users stay calm during emergencies
- ✅ Supports multiple Indian languages
- ✅ Available 24/7 without internet (with offline mode)
- ✅ Complements the AI calling system
- ✅ Can save lives by guiding users until help arrives

**Key Difference from AI Calling**:
- **AI Calling**: Calls your emergency contacts to get help
- **Chatbot**: Guides YOU on what to do right now

Both work together to provide comprehensive emergency response!
